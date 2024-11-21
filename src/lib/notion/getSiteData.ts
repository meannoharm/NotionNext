import BLOG from 'blog.config';
import { getDataFromCache, setDataToCache } from '@/lib/cache/cacheManager';
import { getPostBlocks } from './getPostBlocks';
import { idToUuid } from 'notion-utils';
import { getCategories } from './getCategories';
import getPageIds from './getPageIds';
import { getTags } from './getTags';
import getPageProperties from './getPageProperties';
import { mapImgUrl, compressImage } from './mapImage';
import { PageStatus, PageType } from '@/types/notion';
import dayjs from 'dayjs';
import { isHrefStartWithHttp, isEmoji } from '@/lib/utils';

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

  // the first view is all pages
  // the second view is config
  const [pageIds, [configId]] = getPageIds(
    block.collection_id || null,
    pageRecordMap.collection_query,
    pageRecordMap.collection_view,
    block.view_ids,
  );

  const pages: Page[] = [];
  const publishedPosts: Page[] = [];
  const allPages: Page[] = [];
  let configPage: Partial<Config> | null = null;
  let notice: Page | null = null;

  if (configId) {
    try {
      configPage = await getConfig(configId);
    } catch (error) {
      console.error(
        `Error getting properties for config page ${configId}:`,
        error,
      );
    }
  }
  const config = configPage ? { ...BLOG, ...configPage } : BLOG;

  await Promise.all(
    pageIds.map(async (pageId) => {
      if (configId && pageId === configId) return;
      try {
        const page = await getPageProperties(
          pageId,
          blockMap,
          schemaMap,
          config,
        );
        if (!page || !page.type) return;

        // The Notice page is unique; only the first one will be loaded
        if (
          !notice &&
          page.type === PageType.Notice &&
          page.status === PageStatus.Published
        ) {
          notice = await getNotice(page);
        }

        // for published post
        if (
          page.type === PageType.Post &&
          page.status === PageStatus.Published
        ) {
          publishedPosts.push(page);
          allPages.push(page);
        }

        // page for custom nav menu
        if (
          page.type === PageType.Page &&
          page.status === PageStatus.Published
        ) {
          pages.push(page);
          allPages.push(page);
        }
      } catch (error) {
        console.error(`Error getting properties for page ${pageId}:`, error);
        return null;
      }
    }),
  );

  // Sort by date
  if (config.POSTS_SORT_BY === 'date') {
    allPages.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));
    publishedPosts.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));
  }

  const categoryOptions = getCategories(publishedPosts, schemaMap);
  const tagOptions = getTags(publishedPosts, schemaMap);
  const latestPosts = getLatestPosts(publishedPosts, 6);
  const navList = getNavList(pages);

  return {
    id: pageId,
    notice,
    siteInfo,
    allPages,
    block,
    tagOptions,
    categoryOptions,
    navList,
    postCount: publishedPosts.length,
    publishedPosts,
    latestPosts,
    config,
  };
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
      dayjs(b.lastEditedDate || b.date).diff(a.lastEditedDate || a.date),
    )
    .slice(0, latestPostCount);
}

/**
 * 获取用户自定义单页菜单
 * @param notionPageData
 * @returns {Promise<[]|*[]>}
 */
function getNavList(navPages: Page[]): Nav[] {
  const pageMap: Record<string, Nav> = {};
  const navMenus: Nav[] = [];

  navPages.forEach((page) => {
    console.log(page);
    pageMap[page.id] = {
      id: page.id,
      show: true,
      icon: page.icon,
      title: page.title,
      to: isHrefStartWithHttp(page.slug) ? page.slug : `/${page.slug}`,
      target: isHrefStartWithHttp(page.slug) ? '_blank' : '_self',
      subMenus: [],
    };
  });

  navPages.forEach((page) => {
    if (page.parentId) {
      const parent = pageMap[page.parentId];
      if (parent) {
        parent.subMenus!.push(pageMap[page.id]);
      }
    } else {
      navMenus.push(pageMap[page.id]);
    }
  });

  return navMenus;
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

  // 站点图标不能是emoji
  if (!icon || isEmoji(icon)) {
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
