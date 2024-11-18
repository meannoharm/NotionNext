import BLOG from 'blog.config';
import { getDataFromCache, setDataToCache } from '@/lib/cache/cacheManager';
import { getPostBlocks } from './getPostBlocks';
import { idToUuid } from 'notion-utils';
import { getCategories } from './getCategories';
import getAllPageIds from './getAllPageIds';
import { getTags } from './getTags';
import getPageProperties from './getPageProperties';
import { mapImgUrl, compressImage } from './mapImage';
import dayjs from 'dayjs';

import {
  type CustomNav,
  type Page,
  type SiteInfo,
  type Site,
  type PatchedCollection,
  PagePropertiesStatus,
  PagePropertiesType,
} from '@/types/notion';
import getConfig from './getConfig';

/**
 * 获取站点数据
 * @param {*} from
 * @returns
 *
 */
export async function getSiteData(from: string) {
  // 从notion获取
  const data = await getSiteDataFromCache(idToUuid(BLOG.NOTION_PAGE_ID), from);
  return data;
  // const db = cloneDeep(data);
  // 不返回的敏感数据
  // delete db.block;
  // delete db.schema;
  // delete db.rawMetadata;
  // delete db.pageIds;
  // delete db.viewIds;
  // delete db.collection;
  // delete db.collectionQuery;
  // delete db.collectionId;
  // delete db.collectionView;
  // return db;
}

/**
 * 获取最新文章 根据最后修改时间倒序排列
 * @param {*} allPages
 * @param {*} latestPostCount
 * @returns {Page[]}
 */
function getLatestPosts(allPages: Page[], latestPostCount: number): Page[] {
  const allPosts = allPages.filter(
    (page) => page.type === 'Post' && page.status === 'Published',
  );

  const latestPosts = Object.create(allPosts).sort((a: Page, b: Page) => {
    const dateA = dayjs(a?.lastEditedDate || a?.publishDate);
    const dateB = dayjs(b?.lastEditedDate || b?.publishDate);
    return dateB.isAfter(dateA) ? 1 : -1;
  });
  return latestPosts.slice(0, latestPostCount);
}

/**
 * whole notion template
 * @param pageId
 * @param from 请求来源
 * @returns {Promise<JSX.Element|*|*[]>}
 */
export async function getSiteDataFromCache(
  pageId: string,
  from: string,
): Promise<Site> {
  // 尝试从缓存获取
  const cacheKey = 'page_block_' + pageId;
  const data = await getDataFromCache<Site>(cacheKey);
  if (data && data.pageIds?.length > 0) {
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
 * 获取用户自定义单页菜单
 * @param notionPageData
 * @returns {Promise<[]|*[]>}
 */
function getCustomNav(allPages: Page[]) {
  const customNav: CustomNav[] = [];
  if (allPages && allPages.length > 0) {
    allPages.forEach((p: Page) => {
      if (p?.slug?.indexOf('http') === 0) {
        customNav.push({
          icon: p.icon || '',
          name: p.title,
          to: p.slug,
          target: '_blank',
          show: true,
        });
      } else {
        customNav.push({
          icon: p.icon || '',
          name: p.title,
          to: '/' + p.slug,
          target: '_self',
          show: true,
        });
      }
    });
  }
  return customNav;
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
  if (!post) {
    return null;
  }

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
  const blockMap = pageRecordMap.block || {};
  const block = blockMap[pageId].value;
  // Check Type Page-Database和Inline-Database
  if (
    block.type !== 'collection_view_page' &&
    block.type !== 'collection_view'
  ) {
    console.error(`pageId "${pageId}" is not a database`);
    throw Error(`pageId "${pageId}" is not a database`);
    // return EmptyData(pageUuid);
  }
  const collection = Object.values(pageRecordMap.collection)[0].value || {};
  const siteInfo = getSiteInfo(collection as PatchedCollection);

  const collectionId = block.collection_id || null;
  const viewIds = block.view_ids;

  const collectionQuery = pageRecordMap.collection_query;
  const collectionView = pageRecordMap.collection_view;

  const schemaMap = collection.schema;

  const pageIds = getAllPageIds(
    collectionQuery,
    collectionId,
    collectionView,
    viewIds,
  );
  if (pageIds.length === 0) {
    console.error(
      '获取到的文章列表为空，请检查notion模板',
      collectionQuery,
      collection,
      collectionView,
      viewIds,
      pageRecordMap,
    );
  }

  const itemProperties: Page[] = (
    await Promise.all(
      pageIds.map(async (pageId) => {
        if (blockMap[pageId]?.value) {
          try {
            const properties = await getPageProperties(
              pageId,
              blockMap,
              schemaMap,
            );
            return properties || null;
          } catch (error) {
            console.error(
              `Error getting properties for page ${pageId}:`,
              error,
            );
            return null;
          }
        }
        return null;
      }),
    )
  ).filter(Boolean) as Page[];

  // 查找所有的Post和Page
  const allPages: Page[] = [];
  const publishedPosts: Page[] = [];

  itemProperties.forEach((page) => {
    if (
      page.type === PagePropertiesType.Post &&
      page.status === PagePropertiesStatus.Published
    ) {
      publishedPosts.push(page);
    }
    if (
      page &&
      page.slug &&
      !page.slug?.startsWith('http') &&
      (page.status === PagePropertiesStatus.Invisible ||
        page.status === PagePropertiesStatus.Published)
    ) {
      allPages.push(page);
    }
  });

  // Sort by date
  if (BLOG.POSTS_SORT_BY === 'date') {
    allPages.sort((a, b) => {
      return dayjs(b.publishDate).isAfter(a.publishDate) ? 1 : -1;
    });
  }

  const notice = await getNotice(
    itemProperties.filter(
      (post) =>
        post &&
        post.type &&
        post.type === PagePropertiesType.Notice &&
        post.status &&
        post.status === PagePropertiesStatus.Published,
    )[0],
  );

  // load config
  const config = await getConfig(
    itemProperties.find((post) => post.type === PagePropertiesType.Config),
  );

  const categoryOptions = getCategories(publishedPosts, schemaMap);
  const tagOptions = getTags(publishedPosts, schemaMap);
  // 旧的菜单
  const customNav = getCustomNav(
    itemProperties.filter(
      (post) =>
        post?.type === PagePropertiesType.Page &&
        post.status === PagePropertiesStatus.Published,
    ),
  );

  const latestPosts = getLatestPosts(allPages, 6);

  return {
    notice,
    siteInfo,
    allPages,
    collection,
    collectionQuery,
    collectionId,
    collectionView,
    viewIds,
    blockMap,
    block,
    schema: schemaMap,
    tagOptions,
    categoryOptions,
    customNav,
    postCount: publishedPosts.length,
    publishedPosts,
    pageIds,
    latestPosts,
  };
}
