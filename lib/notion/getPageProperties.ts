import { getTextContent, getDateValue } from 'notion-utils';
import { NotionAPI } from 'notion-client';
import BLOG from '@/blog.config';
import formatDate from '../formatDate';
// import { createHash } from 'crypto'
import md5 from 'js-md5';
import { mapImgUrl } from './mapImage';

import {
  type BlockMap,
  type PageProperties,
  type CollectionPropertySchemaMap,
  type SelectOption,
  PagePropertiesType,
} from './types';

const excludeProperties = ['date', 'select', 'multi_select', 'person'];

export default async function getPageProperties(
  id: string,
  blockMap: BlockMap,
  schemaMap: CollectionPropertySchemaMap,
  tagOptions: SelectOption[],
  authToken?: string,
): Promise<PageProperties> {
  const properties: Partial<PageProperties> = { id: id };
  const block = blockMap[id].value;

  Object.entries(blockMap[id].value.properties).forEach(async ([key, val]) => {
    const schema = schemaMap[key];
    if (schema.type && !excludeProperties.includes(schema.type)) {
      properties[schema.name] = getTextContent(val);
    } else {
      switch (schema.type) {
        case 'date': {
          properties[schema.name] = getDateValue(val);
          break;
        }
        case 'select':
        case 'multi_select': {
          properties[schema.name] = getTextContent(val).split(',');
          break;
        }
        case 'person': {
          const rawUsers = val.flat();
          const users = [];
          const api = new NotionAPI({ authToken });

          for (let i = 0; i < rawUsers.length; i++) {
            if (rawUsers[i][0][1]) {
              const userId = rawUsers[i][0];
              const res = await api.getUsers(userId);
              const resValue =
                res?.recordMapWithRoles?.notion_user?.[userId[1]]?.value;
              const user = {
                id: resValue?.id,
                first_name: resValue?.given_name,
                last_name: resValue?.family_name,
                profile_photo: resValue?.profile_photo,
              };
              users.push(user);
            }
          }
          properties[schema.name] = users;
          break;
        }
        default:
          break;
      }
    }
  });

  // 映射键：用户自定义表头名
  const fieldNames = BLOG.NOTION_PROPERTY_NAME;
  if (fieldNames) {
    Object.keys(fieldNames).forEach((key) => {
      if (fieldNames[key] && properties[fieldNames[key]])
        properties[key] = properties[fieldNames[key]];
    });
  }

  // type\status\category 是单选下拉框 取数组第一个
  properties.type = properties.type?.[0] || '';
  properties.status = properties.status?.[0] || '';
  properties.category = properties.category?.[0] || '';

  // 映射值：用户个性化type和status字段的下拉框选项，在此映射回代码的英文标识
  mapProperties(properties);

  properties.publishDate = new Date(
    properties?.date?.start_date || block.created_time,
  ).getTime();
  properties.publishDay = formatDate(properties.publishDate, BLOG.LANG);
  properties.lastEditedDate = new Date(block?.last_edited_time);
  properties.lastEditedDay = formatDate(
    new Date(block?.last_edited_time),
    BLOG.LANG,
  );
  properties.fullWidth = block.format?.page_full_width ?? false;
  properties.pageIcon =
    mapImgUrl(blockMap[id].value?.format?.page_icon, blockMap[id].value) ?? '';
  properties.pageCover =
    mapImgUrl(blockMap[id].value?.format?.page_cover, blockMap[id].value) ?? '';
  properties.pageCoverThumbnail =
    mapImgUrl(
      blockMap[id].value?.format?.page_cover,
      blockMap[id].value,
      'block',
      'pageCoverThumbnail',
    ) ?? '';
  properties.content = block.content ?? [];
  properties.tagItems =
    properties?.tags?.map((tag) => {
      return {
        name: tag,
        color: tagOptions?.find((t) => t.value === tag)?.color || 'gray',
      };
    }) || [];
  delete properties.content;

  // 处理URL
  if (properties.type === BLOG.NOTION_PROPERTY_NAME.type_post) {
    properties.slug = BLOG.POST_URL_PREFIX
      ? generateCustomizeUrl(properties)
      : properties.slug ?? properties.id;
  } else if (properties.type === BLOG.NOTION_PROPERTY_NAME.type_page) {
    properties.slug = properties.slug ?? properties.id;
  } else if (
    properties.type === BLOG.NOTION_PROPERTY_NAME.type_menu ||
    properties.type === BLOG.NOTION_PROPERTY_NAME.type_sub_menu
  ) {
    // 菜单路径为空、作为可展开菜单使用
    properties.to = properties.slug ?? '#';
    properties.name = properties.title ?? '';
  }

  // 开启伪静态路径
  if (JSON.parse(BLOG.PSEUDO_STATIC)) {
    if (
      !properties?.slug?.endsWith('.html') &&
      !properties?.slug?.startsWith('http')
    ) {
      properties.slug += '.html';
    }
  }
  properties.password = properties.password
    ? md5(properties.slug + properties.password)
    : '';
  return properties;
}

/**
 * 映射用户自定义表头
 */
function mapProperties(properties: PageProperties) {
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
    properties.status = PagePropertiesType.Published;
  }
  if (properties.status === BLOG.NOTION_PROPERTY_NAME.status_invisible) {
    properties.status = PagePropertiesType.Invisible;
  }
}

/**
 * 获取自定义URL
 * @param {*} postProperties
 * @returns
 */
function generateCustomizeUrl(postProperties: PageProperties) {
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
        0,
      );
    } else if (pattern === '%day%' && postProperties?.publishDay) {
      const formatPostCreatedDate = new Date(postProperties?.publishDay);
      fullPrefix += String(formatPostCreatedDate.getUTCDate()).padStart(2, 0);
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
