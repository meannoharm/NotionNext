import { getTextContent, getDateValue } from 'notion-utils';
import md5 from 'js-md5';
import { mapImgUrl } from './mapImage';
import dayjs from 'dayjs';
import { PageType } from '@/types/notion';
import { getParentId, getChildrenIds } from './getTree';

import type {
  BlockMap,
  Page,
  CollectionPropertySchemaMap,
  Decoration,
} from '@/types/notion';
import type { Config } from '@/types';

// get properties for each line in collection
export default async function getPageProperties(
  id: string,
  blockMap: BlockMap,
  schemaMap: CollectionPropertySchemaMap,
  config: Config,
): Promise<Page> {
  const pageInfo: Partial<Page> & { [key: string]: any } = {};
  const block = blockMap[id].value;

  const schemaActions: Record<
    string,
    (value: Decoration[], name: string) => void
  > = {
    date: (value, name) => {
      const formatDate = getDateValue(value);
      if (formatDate?.type === 'datetime') {
        pageInfo[name] = dayjs(
          `${formatDate.start_date} ${formatDate.start_time}`,
        ).valueOf();
      } else if (formatDate?.type === 'date') {
        pageInfo[name] = dayjs(formatDate.start_date).valueOf();
      }
    },
    multi_select: (value, name) => {
      pageInfo[name] = getTextContent(value).split(',');
    },

    default: (value, name) => {
      pageInfo[name] = getTextContent(value);
    },
  };

  Object.entries<Decoration[]>(block.properties).forEach(
    async ([key, value]) => {
      const { name, type } = schemaMap[key];
      if (name === 'Parent item') {
        pageInfo['parentId'] = getParentId(value);
      }
      if (name === 'Sub-item') {
        pageInfo['childrenIds'] = getChildrenIds(value);
      } else {
        const action = schemaActions[type] || schemaActions.default;
        action(value, name);
      }
    },
  );

  // fallback for type checking
  pageInfo.id = id;
  pageInfo.type = pageInfo?.type || null;
  pageInfo.title = pageInfo?.title || '';
  pageInfo.status = pageInfo?.status || null;
  pageInfo.category = pageInfo?.category || '';
  pageInfo.icon = pageInfo?.icon || '';
  pageInfo.date = pageInfo?.date || dayjs(block.created_time).valueOf();
  pageInfo.lastEditedDate = block?.last_edited_time;
  pageInfo.pageIcon = mapImgUrl(block?.format?.page_icon, block);
  pageInfo.pageCover = mapImgUrl(block?.format?.page_cover, block);
  pageInfo.pageCoverThumbnail = mapImgUrl(
    block?.format?.page_cover,
    block,
    'block',
  );
  pageInfo.tags = pageInfo?.tags || [];
  pageInfo.summary = pageInfo?.summary || '';

  // handle slug
  if (pageInfo.type === PageType.Post) {
    // parse post's prefix from config
    pageInfo.slug = generatePostSlug(pageInfo as Page, config);
  } else if (pageInfo.type === PageType.Page) {
    pageInfo.slug = pageInfo.slug ?? pageInfo.id;
    if (pageInfo.childrenIds && pageInfo.childrenIds.length > 0) {
      // non-leaf node pages' href are set as placeholders.
      pageInfo.slug = '#';
    }
  }

  // non-leaf node pages' href are set as placeholders.
  if (pageInfo.childrenIds && pageInfo.childrenIds.length > 0) {
    pageInfo.type = PageType.Menu;
    pageInfo.slug = '#';
  }

  pageInfo.password = pageInfo.password
    ? md5(pageInfo.slug + pageInfo.password)
    : '';

  return pageInfo as Page;
}

/**
 * 获取自定义URL
 * 可以根据变量生成URL
 * 支持：%category%/%year%/%month%/%day%/%slug%
 * @param {*} page
 * @returns
 */
function generatePostSlug(page: Page, config: Config) {
  // 默认占位符的回退值
  const fallbackSlug = page.slug ?? page.id;
  const date = page.date ? dayjs(page.date) : null;

  // 用于存储最终生成的路径片段
  const segments: string[] = [];
  const allSlugPatterns = config.POST_URL_PREFIX.split('/');
  const categoryPrefixMap = config.POST_URL_PREFIX_MAPPING_CATEGORY;

  // 遍历所有占位符模式，生成对应的URL片段
  for (const pattern of allSlugPatterns) {
    if (pattern === '%year%' && date) {
      segments.push(date.year().toString());
    } else if (pattern === '%month%' && date) {
      segments.push(date.format('MM'));
    } else if (pattern === '%day%' && date) {
      segments.push(date.format('DD'));
    } else if (pattern === '%slug%') {
      segments.push(fallbackSlug);
    } else if (pattern === '%category%' && page?.category) {
      const category = categoryPrefixMap[page.category] ?? page.category;
      segments.push(category);
    } else if (!pattern.includes('%')) {
      segments.push(pattern); // 处理非占位符的固定部分
    }
  }

  // 合并片段，确保没有多余的斜杠
  const fullPrefix = segments.join('/');

  // 最终拼接slug部分
  return fullPrefix ? `${fullPrefix}/${fallbackSlug}` : fallbackSlug;
}
