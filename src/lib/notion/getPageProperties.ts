import { getTextContent, getDateValue } from 'notion-utils';
// import { NotionAPI } from 'notion-client';
import BLOG from 'blog.config';
import md5 from 'js-md5';
import { mapImgUrl } from './mapImage';
import dayjs from 'dayjs';
import { PagePropertiesType, PagePropertiesStatus } from '@/types/notion';

import type {
  BlockMap,
  RawPage,
  CollectionPropertySchemaMap,
  Decoration,
} from '@/types/notion';

type TempPageInfo = Partial<RawPage> & { [key: string]: any };
const excludeProperties = ['date', 'select', 'multi_select', 'person'];

// get properties for each line in collection
export default async function getPageProperties(
  id: string,
  blockMap: BlockMap,
  schemaMap: CollectionPropertySchemaMap,
  // authToken?: string,
): Promise<RawPage> {
  const pageInfo: TempPageInfo = { id: id };
  const block = blockMap[id].value;

  Object.entries<Decoration[]>(block.properties).forEach(
    async ([key, value]) => {
      const { name, type } = schemaMap[key];
      if (type && !excludeProperties.includes(type)) {
        pageInfo[name] = getTextContent(value);
      } else {
        switch (type) {
          case 'date': {
            pageInfo[name] = getDateValue(value);
            break;
          }
          case 'select':
          case 'multi_select': {
            pageInfo[name] = getTextContent(value).split(',');
            break;
          }
          case 'person': {
            // TODO 这段没看懂，以后再研究
            // const rawUsers = value.flat();
            // const users = [];
            // const api = new NotionAPI({ authToken });

            // for (let i = 0; i < rawUsers.length; i++) {
            //   if (rawUsers[i][0][1]) {
            //     const userId = rawUsers[i][0];
            //     const res = await api.getUsers(userId);
            //     const resValue =
            //       res?.recordMapWithRoles?.notion_user?.[userId[1]]?.value;
            //     const user = {
            //       id: resValue?.id,
            //       first_name: resValue?.given_name,
            //       last_name: resValue?.family_name,
            //       profile_photo: resValue?.profile_photo,
            //     };
            //     users.push(user);
            //   }
            // }
            // pageInfo[name] = users;
            break;
          }
          default:
            break;
        }
      }
    },
  );

  // 映射键：用户自定义表头名
  const fieldNames = BLOG.NOTION_PROPERTY_NAME;
  if (fieldNames) {
    for (const [key, value] of Object.entries(fieldNames)) {
      if (value && pageInfo[value]) pageInfo[key] = pageInfo[value];
    }
  }

  // type\status\category 是单选下拉框 取数组第一个
  if (pageInfo.type && pageInfo.type[0]) {
    pageInfo.type = pageInfo.type[0] as PagePropertiesType;
  }
  if (pageInfo.status && pageInfo.status[0]) {
    pageInfo.status = pageInfo.status[0] as PagePropertiesStatus;
  }
  if (pageInfo.category && pageInfo.category[0])
    pageInfo.category = pageInfo.category[0];

  if (!pageInfo.tags) pageInfo.tags = [];

  // 映射值：用户个性化type和status字段的下拉框选项，在此映射回代码的英文标识
  mapProperties(pageInfo);

  pageInfo.publishDate = dayjs(
    pageInfo?.date?.start_date || block.created_time,
  ).valueOf();
  pageInfo.lastEditedDate = block?.last_edited_time;
  pageInfo.pageIcon = mapImgUrl(block?.format?.page_icon, block);
  pageInfo.pageCover = mapImgUrl(block?.format?.page_cover, block);
  pageInfo.pageCoverThumbnail = mapImgUrl(
    block?.format?.page_cover,
    block,
    'block',
  );

  // 处理URL
  if (pageInfo.type === BLOG.NOTION_PROPERTY_NAME.type_post) {
    pageInfo.slug = BLOG.POST_URL_PREFIX
      ? generateCustomizeUrl(pageInfo)
      : (pageInfo.slug ?? pageInfo.id);
  } else if (pageInfo.type === BLOG.NOTION_PROPERTY_NAME.type_page) {
    pageInfo.slug = pageInfo.slug ?? pageInfo.id;
  } else if (
    pageInfo.type === BLOG.NOTION_PROPERTY_NAME.type_menu ||
    pageInfo.type === BLOG.NOTION_PROPERTY_NAME.type_sub_menu
  ) {
    // 菜单路径为空、作为可展开菜单使用
    pageInfo.to = pageInfo.slug ?? '#';
    pageInfo.name = pageInfo.title ?? '';
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

  return pageInfo as RawPage;
}

/**
 * 映射用户自定义表头
 */
function mapProperties(properties: TempPageInfo) {
  if (properties.type === BLOG.NOTION_PROPERTY_NAME.type_post) {
    properties.type = PagePropertiesType.Post;
  }
  if (properties.type === BLOG.NOTION_PROPERTY_NAME.type_page) {
    properties.type = PagePropertiesType.Page;
  }
  if (properties.type === BLOG.NOTION_PROPERTY_NAME.type_notice) {
    properties.type = PagePropertiesType.Notice;
  }
  if (properties.status === BLOG.NOTION_PROPERTY_NAME.status_publish) {
    properties.status = PagePropertiesStatus.Published;
  }
  if (properties.status === BLOG.NOTION_PROPERTY_NAME.status_invisible) {
    properties.status = PagePropertiesStatus.Invisible;
  }
}

/**
 * 获取自定义URL
 * @param {*} postProperties
 * @returns
 */
function generateCustomizeUrl(postProperties: TempPageInfo) {
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
