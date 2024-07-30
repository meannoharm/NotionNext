import BLOG from '@/blog.config';
import { getDataFromCache, setDataToCache } from '@/lib/cache/cacheManager';
import { getPostBlocks } from '@/lib/notion/getPostBlocks';
import { idToUuid } from 'notion-utils';
import { getAllCategories } from './getAllCategories';
import getAllPageIds from './getAllPageIds';
import { getAllTags } from './getAllTags';
import getPageProperties from './getPageProperties';
import { mapImgUrl, compressImage } from './mapImage';
import { cloneDeep } from 'lodash';

import type {
  CustomNav,
  PageProperties,
  BlockMap,
  Collection,
  CollectionPropertySchemaMap,
  SelectOption,
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
  const db = cloneDeep(data);
  // 不返回的敏感数据
  delete db.block;
  delete db.schema;
  delete db.rawMetadata;
  delete db.pageIds;
  delete db.viewIds;
  delete db.collection;
  delete db.collectionQuery;
  delete db.collectionId;
  delete db.collectionView;
  return db;
}

/**
 * 获取最新文章 根据最后修改时间倒序排列
 * @param {*}} param0
 * @returns
 */
function getLatestPosts(allPages, latestPostCount: number) {
  const allPosts = allPages?.filter(
    (page) => page.type === 'Post' && page.status === 'Published',
  );

  const latestPosts = Object.create(allPosts).sort((a, b) => {
    const dateA = new Date(a?.lastEditedDay || a?.publishDate);
    const dateB = new Date(b?.lastEditedDay || b?.publishDate);
    return dateB - dateA;
  });
  return latestPosts.slice(0, latestPostCount);
}

/**
 * 获取指定notion的collection数据
 * @param pageId
 * @param from 请求来源
 * @returns {Promise<JSX.Element|*|*[]>}
 */
export async function getNotionPageData(pageId: string, from: string) {
  // 尝试从缓存获取
  const cacheKey = 'page_block_' + pageId;
  const data = await getDataFromCache(cacheKey);
  if (data && data.pageIds?.length > 0) {
    console.log('[缓存]:', `from:${from}`, `root-page-id:${pageId}`);
    return data;
  }
  const db = await getDataBaseInfoByNotionAPI(pageId, from);
  // 存入缓存
  if (db) {
    await setDataToCache(cacheKey, db);
  }
  return db;
}

/**
 * 获取用户自定义单页菜单
 * @param notionPageData
 * @returns {Promise<[]|*[]>}
 */
function getCustomNav(allPages: PageProperties[]) {
  const customNav: CustomNav[] = [];
  if (allPages && allPages.length > 0) {
    allPages.forEach((p: PageProperties) => {
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
 * 获取自定义菜单
 * @param {*} allPages
 * @returns
 */
function getCustomMenu({ collectionData }) {
  const menuPages = collectionData.filter(
    (post) =>
      (post?.type === BLOG.NOTION_PROPERTY_NAME.type_menu ||
        post?.type === BLOG.NOTION_PROPERTY_NAME.type_sub_menu) &&
      post.status === 'Published',
  );
  const menus = [];
  if (menuPages && menuPages.length > 0) {
    menuPages.forEach((e) => {
      e.show = true;
      if (e?.slug?.indexOf('http') === 0) {
        e.target = '_blank';
      }
      if (e.type === BLOG.NOTION_PROPERTY_NAME.type_menu) {
        menus.push(e);
      } else if (e.type === BLOG.NOTION_PROPERTY_NAME.type_sub_menu) {
        const parentMenu = menus[menus.length - 1];
        if (parentMenu) {
          if (parentMenu.subMenus) {
            parentMenu.subMenus.push(e);
          } else {
            parentMenu.subMenus = [e];
          }
        }
      }
    });
  }
  return menus;
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
function getSiteInfo(collection: Collection, block: BlockMap) {
  const title = collection?.name?.[0][0] || BLOG.TITLE;
  const description = collection?.description
    ? Object.assign(collection).description[0][0]
    : BLOG.DESCRIPTION;
  const pageCover = collection?.cover
    ? mapImgUrl(collection?.cover, block[idToUuid(BLOG.NOTION_PAGE_ID)]?.value)
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
 * 获取导航用的精减文章列表
 * gitbook主题用到，只保留文章的标题分类标签分类信息，精减掉摘要密码日期等数据
 * 导航页面的条件，必须是Posts
 * @param {*} param0
 */
export function getNavPages({ allPages }) {
  const allNavPages = allPages?.filter((post) => {
    return (
      post &&
      post?.slug &&
      !post?.slug?.startsWith('http') &&
      post?.type === 'Post' &&
      post?.status === 'Published'
    );
  });

  return allNavPages.map((item) => ({
    id: item.id,
    title: item.title || '',
    pageCoverThumbnail: item.pageCoverThumbnail || '',
    category: item.category || null,
    tags: item.tags || null,
    summary: item.summary || null,
    slug: item.slug,
    lastEditedDate: item.lastEditedDate,
  }));
}

/**
 * 获取公告
 */
async function getNotice(post) {
  if (!post) {
    return null;
  }

  post.blockMap = await getPostBlocks(post.id, 'data-notice');
  return post;
}

// 没有数据时返回
const EmptyData = (pageId: string) => {
  const empty = {
    notice: null,
    siteInfo: getSiteInfo(),
    allPages: [
      {
        id: 1,
        title: `无法获取Notion数据，请检查Notion_ID： \n 当前 ${pageId}`,
        summary:
          '访问文档获取帮助→ https://tangly1024.com/article/vercel-deploy-notion-next',
        status: 'Published',
        type: 'Post',
        slug: '13a171332816461db29d50e9f575b00d',
        date: {
          start_date: '2023-04-24',
          lastEditedDay: '2023-04-24',
          tagItems: [],
        },
      },
    ],
    allNavPages: [],
    collection: [],
    collectionQuery: {},
    collectionId: null,
    collectionView: {},
    viewIds: [],
    block: {},
    schema: {},
    tagOptions: [],
    categoryOptions: [],
    rawMetadata: {},
    customNav: [],
    customMenu: [],
    postCount: 1,
    pageIds: [],
    latestPosts: [],
  };
  return empty;
};

/**
 * 调用NotionAPI获取Page数据
 * @returns {Promise<JSX.Element|null|*>}
 */
async function getDataBaseInfoByNotionAPI(pageId: string, from: string) {
  const pageRecordMap = await getPostBlocks(pageId, from);
  if (!pageRecordMap) {
    console.error('can`t get Notion Data ; Which id is: ', pageId);
    return {};
  }
  const pageUuid = idToUuid(pageId);
  const blockMap = pageRecordMap.block || {};
  const rawMetadata = blockMap[pageUuid].value;
  // Check Type Page-Database和Inline-Database
  if (
    rawMetadata.type !== 'collection_view_page' &&
    rawMetadata.type !== 'collection_view'
  ) {
    console.error(`pageId "${pageUuid}" is not a database`);
    return EmptyData(pageUuid);
  }
  const collection = Object.values(pageRecordMap.collection)[0]?.value || {};
  const siteInfo = getSiteInfo(collection, blockMap);

  const collectionId = rawMetadata.collection_id;
  const viewIds = rawMetadata.view_ids;

  const collectionQuery = pageRecordMap.collection_query;
  const collectionView = pageRecordMap.collection_view;

  const schemaMap = collection.schema;

  const collectionData: PageProperties[] = [];
  const pageIds = getAllPageIds(
    collectionQuery,
    collectionId,
    collectionView,
    viewIds,
  );
  if (pageIds?.length === 0) {
    console.error(
      '获取到的文章列表为空，请检查notion模板',
      collectionQuery,
      collection,
      collectionView,
      viewIds,
      pageRecordMap,
    );
  }

  pageIds.forEach(async (id) => {
    if (blockMap[id].value) {
      const properties =
        (await getPageProperties(
          id,
          blockMap,
          schemaMap,
          getTagOptions(schemaMap),
        )) || null;

      if (properties) {
        collectionData.push(properties);
      }
    }
  });

  // 文章计数
  let postCount = 0;
  // 查找所有的Post和Page
  const allPages = collectionData.filter((post) => {
    if (post.type === 'Post' && post.status === 'Published') {
      postCount++;
    }
    return (
      post &&
      post.slug &&
      !post.slug?.startsWith('http') &&
      (post.status === 'Invisible' || post.status === 'Published')
    );
  });

  // Sort by date
  if (BLOG.POSTS_SORT_BY === 'date') {
    allPages.sort((a, b) => {
      return b?.publishDate - a?.publishDate;
    });
  }

  const notice = await getNotice(
    collectionData.filter(
      (post) =>
        post &&
        post.type &&
        post.type === 'Notice' &&
        post.status &&
        post.status === 'Published',
    )[0],
  );
  const categoryOptions = getAllCategories(
    allPages,
    getCategoryOptions(schemaMap),
  );
  const tagOptions = getAllTags({
    allPages,
    tagOptions: getTagOptions(schemaMap),
  });
  // 旧的菜单
  const customNav = getCustomNav(
    collectionData.filter(
      (post) => post?.type === 'Page' && post.status === 'Published',
    ),
  );
  // 新的菜单
  const customMenu = await getCustomMenu({ collectionData });
  const latestPosts = getLatestPosts(allPages, 6);
  const allNavPages = getNavPages({ allPages });

  return {
    notice,
    siteInfo,
    allPages,
    allNavPages,
    collection,
    collectionQuery,
    collectionId,
    collectionView,
    viewIds,
    block: blockMap,
    schema: schemaMap,
    tagOptions,
    categoryOptions,
    rawMetadata,
    customNav,
    customMenu,
    postCount,
    pageIds,
    latestPosts,
  };
}
