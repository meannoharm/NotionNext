import BLOG from '@/blog.config';
import { getDataFromCache, setDataToCache } from '@/lib/cache/cacheManager';
import { getPostBlocks } from '@/lib/notion/getPostBlocks';
import { idToUuid } from 'notion-utils';
import { getAllCategories } from './getAllCategories';
import getAllPageIds from './getAllPageIds';
import { getAllTags } from './getAllTags';
import getPageProperties from './getPageProperties';
import { mapImgUrl, compressImage } from './mapImage';
import dayjs from 'dayjs';

import type {
  CustomNav,
  PageInfo,
  BlockMap,
  CollectionPropertySchemaMap,
  SelectOption,
  SiteInfo,
  DataBaseInfo,
  PatchedCollection,
} from './types';

/**
 * 获取博客数据
 * @param {*} pageId
 * @param {*} from
 * @returns
 *
 */
export async function getGlobalData(from: string) {
  // 从notion获取
  const data = await getNotionPageData(BLOG.NOTION_PAGE_ID, from);
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
 * @param {*}} param0
 * @returns
 */
function getLatestPosts(
  allPages: PageInfo[],
  latestPostCount: number,
): PageInfo[] {
  const allPosts = allPages.filter(
    (page) => page.type === 'Post' && page.status === 'Published',
  );

  const latestPosts = Object.create(allPosts).sort(
    (a: PageInfo, b: PageInfo) => {
      const dateA = dayjs(a?.lastEditedDate || a?.publishDate);
      const dateB = dayjs(b?.lastEditedDate || b?.publishDate);
      return dateB.isAfter(dateA) ? 1 : -1;
    },
  );
  return latestPosts.slice(0, latestPostCount);
}

/**
 * 获取指定notion的collection数据
 * @param pageId
 * @param from 请求来源
 * @returns {Promise<JSX.Element|*|*[]>}
 */
export async function getNotionPageData(
  pageId: string,
  from: string,
): Promise<DataBaseInfo> {
  // 尝试从缓存获取
  const cacheKey = 'page_block_' + pageId;
  const data = await getDataFromCache<DataBaseInfo>(cacheKey);
  if (data && data.pageIds?.length > 0) {
    console.log('[缓存]:', `from:${from}`, `root-page-id:${pageId}`);
    return data;
  }
  const dataBaseInfo = await getDataBaseInfoByNotionAPI(pageId, from);
  // 存入缓存
  if (dataBaseInfo) {
    await setDataToCache(cacheKey, dataBaseInfo);
  }
  return dataBaseInfo;
}

/**
 * 获取用户自定义单页菜单
 * @param notionPageData
 * @returns {Promise<[]|*[]>}
 */
function getCustomNav(allPages: PageInfo[]) {
  const customNav: CustomNav[] = [];
  if (allPages && allPages.length > 0) {
    allPages.forEach((p: PageInfo) => {
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
 * 获取标签选项
 * @param schemaMap
 * @returns {undefined}
 */
function getTagOptions(schemaMap: CollectionPropertySchemaMap): SelectOption[] {
  if (!schemaMap) return [];
  const tagSchema = Object.values(schemaMap).find(
    (e) => e.name === BLOG.NOTION_PROPERTY_NAME.tags,
  );
  return tagSchema?.options || [];
}

/**
 * 获取分类选项
 * @param schemaMap
 * @returns {{}|*|*[]}
 */
function getCategoryOptions(
  schemaMap: CollectionPropertySchemaMap,
): SelectOption[] {
  if (!schemaMap) return [];
  const categorySchema = Object.values(schemaMap).find(
    (e) => e.name === BLOG.NOTION_PROPERTY_NAME.category,
  );
  return categorySchema?.options || [];
}

/**
 * 站点信息
 * @param notionPageData
 * @param from
 * @returns {Promise<{title,description,pageCover,icon}>}
 */
function getSiteInfo(collection: PatchedCollection, block: BlockMap): SiteInfo {
  const title = collection.name[0][0] || BLOG.TITLE;

  const description = collection.description
    ? Object.assign(collection).description[0][0]
    : BLOG.DESCRIPTION;
  const pageCover = collection.cover
    ? mapImgUrl(
        collection.cover,
        block[idToUuid(BLOG.NOTION_PAGE_ID)]?.value.id,
      )
    : BLOG.HOME_BANNER_IMAGE;
  let icon = collection?.icon
    ? mapImgUrl(collection?.icon, collection.id, 'collection')
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
async function getNotice(post: PageInfo) {
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
async function getDataBaseInfoByNotionAPI(
  pageId: string,
  from: string,
): Promise<DataBaseInfo> {
  const pageRecordMap = await getPostBlocks(pageId, from);
  if (!pageRecordMap) {
    console.error('can`t get Notion Data ; Which id is: ', pageId);
    throw Error('can`t get Notion Data');
    // return {};
  }
  const pageUuid = idToUuid(pageId);
  const blockMap = pageRecordMap.block || {};
  const rawBlockData = blockMap[pageUuid].value;
  // Check Type Page-Database和Inline-Database
  if (
    rawBlockData.type !== 'collection_view_page' &&
    rawBlockData.type !== 'collection_view'
  ) {
    console.error(`pageId "${pageUuid}" is not a database`);
    throw Error(`pageId "${pageUuid}" is not a database`);
    // return EmptyData(pageUuid);
  }
  const collection = Object.values(pageRecordMap.collection)[0].value || {};
  console.log(collection);
  const siteInfo = getSiteInfo(collection as PatchedCollection, blockMap);

  const collectionId = rawBlockData.collection_id || null;
  const viewIds = rawBlockData.view_ids;

  const collectionQuery = pageRecordMap.collection_query;
  const collectionView = pageRecordMap.collection_view;

  const schemaMap = collection.schema;
  const tagOptions = getTagOptions(schemaMap);
  const categoryOptions = getCategoryOptions(schemaMap);

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

  const pageProperties: PageInfo[] = (
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
  ).filter(Boolean) as PageInfo[];

  // 查找所有的Post和Page
  const allPages: PageInfo[] = [];
  const publishedPosts: PageInfo[] = [];

  pageProperties.forEach((page) => {
    if (page.type === 'Post' && page.status === 'Published') {
      publishedPosts.push(page);
    }
    if (
      page &&
      page.slug &&
      !page.slug?.startsWith('http') &&
      (page.status === 'Invisible' || page.status === 'Published')
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
    pageProperties.filter(
      (post) =>
        post &&
        post.type &&
        post.type === 'Notice' &&
        post.status &&
        post.status === 'Published',
    )[0],
  );
  const categories = getAllCategories(publishedPosts, categoryOptions);
  const tags = getAllTags(publishedPosts, tagOptions);
  // 旧的菜单
  const customNav = getCustomNav(
    pageProperties.filter(
      (post) => post?.type === 'Page' && post.status === 'Published',
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
    block: blockMap,
    schema: schemaMap,
    tagOptions: tags,
    categoryOptions: categories,
    rawMetadata: rawBlockData,
    customNav,
    postCount: publishedPosts.length,
    publishedPosts,
    pageIds,
    latestPosts,
  };
}
