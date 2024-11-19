import BLOG from 'blog.config';
import { getDataFromCache, setDataToCache } from '@/lib/cache/cacheManager';
import { getPostBlocks } from './getPostBlocks';
import { idToUuid } from 'notion-utils';
import { getCategories } from './getCategories';
import getAllPageIds from './getAllPageIds';
import { getTags } from './getTags';
import getPageProperties from './getPageProperties';
import { mapImgUrl, compressImage } from './mapImage';
import { PageStatus, PageType } from '@/types/notion';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';

import type {
  Nav,
  Page,
  SiteInfo,
  Site,
  PatchedCollection,
} from '@/types/notion';
import type { Config } from '@/types/config';
import getConfig from './getConfig';

/**
 * whole site info
 * @param pageId notion page id
 * @param from request from
 * @returns {Promise<JSX.Element|*|*[]>}
 */
export async function getSiteData(from: string): Promise<Site> {
  const pageId = idToUuid(BLOG.NOTION_PAGE_ID);
  // 尝试从缓存获取
  const cacheKey = `site_data_${pageId}`;
  const data = await getDataFromCache<Site>(cacheKey);
  if (data) {
    console.log('[缓存]:', `from:${from}`, `root-page-id:${pageId}`);
    return data;
  }
  const siteData = await getWholeSiteData(pageId, from);
  // 存入缓存
  if (siteData) {
    await setDataToCache(cacheKey, siteData);
  }
  return siteData;
}

/**
 * 获取最新文章 根据最后修改时间倒序排列
 * @param {*} allPages
 * @param {*} latestPostCount
 * @returns {Page[]}
 */
function getLatestPosts(
  publishedPosts: Page[],
  latestPostCount: number,
): Page[] {
  return [...publishedPosts]
    .sort((a, b) =>
      dayjs(b.lastEditedDate || b.publishDate).diff(
        a.lastEditedDate || a.publishDate,
      ),
    )
    .slice(0, latestPostCount);
}

/**
 * 获取用户自定义单页菜单
 * @param notionPageData
 * @returns {Promise<[]|*[]>}
 */
function getNavList(navPages: Page[]): Nav[] {
  console.log(navPages);

  const menus: Nav[] = [];
  for (const page of navPages) {
    const nav: Nav = {
      show: true,
      icon: page.icon,
      name: page.title,
      to: page.slug?.startsWith('http') ? page.slug : `/${page.slug}`,
      target: page.slug?.startsWith('http') ? '_blank' : '_self',
    };

    if (page.type === PageType.Page) {
      menus.push(nav);
    } else if (page.type === PageType.SubPage) {
      // Find the last added menu, which should be the parent for submenus
      const parentMenu = menus[menus.length - 1];

      if (parentMenu) {
        // If the parent menu exists, ensure it has subMenus and add the current page
        parentMenu.subMenus = parentMenu.subMenus || [];
        parentMenu.subMenus.push(nav);
      }
    }
  }
  return menus;
}

/**
 * 站点信息
 * @param notionPageData
 * @param from
 * @returns {Promise<{title,description,pageCover,icon}>}
 */
function getSiteInfo(collection: PatchedCollection): SiteInfo {
  const title = collection.name[0][0] || BLOG.TITLE;
  const description = collection.description
    ? Object.assign(collection).description[0][0]
    : BLOG.DESCRIPTION;
  const pageCover = collection.cover
    ? mapImgUrl(collection.cover, collection, 'collection')
    : BLOG.HOME_BANNER_IMAGE;
  let icon = collection?.icon
    ? mapImgUrl(collection?.icon, collection, 'collection')
    : BLOG.AVATAR;

  // 用户头像压缩一下
  icon = compressImage(icon);

  // 站点图标不能是emoji情
  const emojiPattern = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
  if (!icon || emojiPattern.test(icon)) {
    icon = BLOG.AVATAR;
  }
  return { title, description, pageCover, icon };
}

/**
 * 获取公告
 */
async function getNotice(post: Page) {
  post.blockMap = await getPostBlocks(post.id, 'data-notice');
  return post;
}

/**
 * 调用NotionAPI获取Page数据
 * @returns {Promise<JSX.Element|null|*>}
 */
async function getWholeSiteData(pageId: string, from: string): Promise<Site> {
  const pageRecordMap = await getPostBlocks(pageId, from);
  if (!pageRecordMap) {
    console.error('can`t get Notion Data ; Which id is: ', pageId);
    throw Error('can`t get Notion Data');
    // return {};
  }
  const blockMap = pageRecordMap.block;
  const block = blockMap[pageId].value;
  if (
    block.type !== 'collection_view_page' &&
    block.type !== 'collection_view'
  ) {
    console.error(`pageId "${pageId}" is not a database`);
    throw Error(`pageId "${pageId}" is not a database`);
  }
  const collection = Object.values(pageRecordMap.collection)[0].value;
  const siteInfo = getSiteInfo(collection as PatchedCollection);
  const schemaMap = collection.schema;

  const pageIds = getAllPageIds(
    block.collection_id || null,
    pageRecordMap.collection_query,
    pageRecordMap.collection_view,
    block.view_ids,
  );

  // 查找所有的Post和Page
  const allPages: Page[] = [];
  const publishedPosts: Page[] = [];
  const navPageList: Page[] = [];
  let config: Config = {};
  let notice: Page | null = null;

  await Promise.all(
    pageIds.map(async (pageId) => {
      try {
        const page = await getPageProperties(pageId, blockMap, schemaMap);
        if (!page.type) return;

        // for published post
        if (
          page.type === PageType.Post &&
          page.status === PageStatus.Published
        ) {
          publishedPosts.push(page as Page);
        }

        // for all page
        if (
          page.slug &&
          !page.slug?.startsWith('http') &&
          (page.status === PageStatus.Invisible ||
            page.status === PageStatus.Published)
        ) {
          allPages.push(page as Page);
        }

        // custom nav menu
        if (
          (page.type === PageType.Page || page.type === PageType.SubPage) &&
          page.status === PageStatus.Published
        ) {
          navPageList.push(page as Page);
        }

        // The Config page is unique; only the first one is selected.
        if (
          isEmpty(config) &&
          page.type === PageType.Config &&
          page.status === PageStatus.Published
        ) {
          config = await getConfig(page);
        }

        // The Notice page is unique; only the first one is selected
        if (
          !notice &&
          page.type === PageType.Notice &&
          page.status === PageStatus.Published
        ) {
          notice = await getNotice(page as Page);
        }
        return page;
      } catch (error) {
        console.error(`Error getting properties for page ${pageId}:`, error);
        return null;
      }
    }),
  );

  // Sort by date
  if (BLOG.POSTS_SORT_BY === 'date') {
    allPages.sort((a, b) => {
      return dayjs(b.publishDate).isAfter(a.publishDate) ? 1 : -1;
    });
  }

  const categoryOptions = getCategories(publishedPosts, schemaMap);
  const tagOptions = getTags(publishedPosts, schemaMap);
  const latestPosts = getLatestPosts(publishedPosts, 6);
  const navList = getNavList(navPageList);

  return {
    id: pageId,
    notice,
    config,
    siteInfo,
    allPages,
    block,
    tagOptions,
    categoryOptions,
    navList,
    postCount: publishedPosts.length,
    publishedPosts,
    latestPosts,
  };
}
