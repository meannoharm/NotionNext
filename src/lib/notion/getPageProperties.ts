import { getTextContent, getDateValue } from 'notion-utils';
import BLOG from 'blog.config';
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

// get properties for each line in collection
export default async function getPageProperties(
  id: string,
  blockMap: BlockMap,
  schemaMap: CollectionPropertySchemaMap,
  // authToken?: string,
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
    parent_item: (value) => {
      pageInfo['parentId'] = getParentId(value);
    },
    sub_item: (value) => {
      pageInfo['childrenIds'] = getChildrenIds(value);
    },
    default: (value, name) => {
      pageInfo[name] = getTextContent(value);
    },
  };

  Object.entries<Decoration[]>(block.properties).forEach(
    async ([key, value]) => {
      const { name, type } = schemaMap[key];
      const action = schemaActions[type] || schemaActions.default;
      action(value, name);
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
    pageInfo.slug = BLOG.POST_URL_PREFIX
      ? generateCustomizeUrl(pageInfo)
      : (pageInfo.slug ?? pageInfo.id);
  } else if (pageInfo.type === PageType.Page) {
    pageInfo.slug = pageInfo.slug ?? pageInfo.id;
    pageInfo.to = pageInfo.slug ?? '#';
  } else if (pageInfo.type === PageType.SubPage) {
    // 菜单路径为空、作为可展开菜单使用
    pageInfo.to = pageInfo.slug ?? '#';
  }

  // 开启伪静态路径
  if (BLOG.PSEUDO_STATIC) {
    if (
      !pageInfo?.slug?.endsWith('.html') &&
      !pageInfo?.slug?.startsWith('http')
    ) {
      pageInfo.slug += '.html';
    }
  }
  pageInfo.password = pageInfo.password
    ? md5(pageInfo.slug + pageInfo.password)
    : '';

  return pageInfo as Page;
}

/**
 * 获取自定义URL
 * @param {*} postProperties
 * @returns
 */
function generateCustomizeUrl(postProperties: any) {
  let fullPrefix = '';
  const allSlugPatterns = BLOG.POST_URL_PREFIX.split('/');
  allSlugPatterns.forEach((pattern, idx) => {
    if (pattern === '%year%' && postProperties?.publishDay) {
      const formatPostCreatedDate = new Date(postProperties?.publishDay);
      fullPrefix += formatPostCreatedDate.getUTCFullYear();
    } else if (pattern === '%month%' && postProperties?.publishDay) {
      const formatPostCreatedDate = new Date(postProperties?.publishDay);
      fullPrefix += String(formatPostCreatedDate.getUTCMonth() + 1).padStart(
        2,
        '0',
      );
    } else if (pattern === '%day%' && postProperties?.publishDay) {
      const formatPostCreatedDate = new Date(postProperties?.publishDay);
      fullPrefix += String(formatPostCreatedDate.getUTCDate()).padStart(2, '0');
    } else if (pattern === '%slug%') {
      fullPrefix += postProperties.slug ?? postProperties.id;
    } else if (!pattern.includes('%')) {
      fullPrefix += pattern;
    } else {
      return;
    }
    if (idx !== allSlugPatterns.length - 1) {
      fullPrefix += '/';
    }
  });
  if (fullPrefix.startsWith('/')) {
    fullPrefix = fullPrefix.substring(1); // 去掉头部的"/"
  }
  if (fullPrefix.endsWith('/')) {
    fullPrefix = fullPrefix.substring(0, fullPrefix.length - 1); // 去掉尾部部的"/"
  }
  return `${fullPrefix}/${postProperties.slug ?? postProperties.id}`;
}
