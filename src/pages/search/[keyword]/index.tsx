import { getSiteData } from '@/lib/notion/getSiteData';
import BLOG from 'blog.config';
import { useLayout } from '@/lib/theme';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getDataFromCache } from '@/lib/cache/cacheManager';

import type { GetStaticProps, GetStaticPaths } from 'next';
import type {
  PageMeta,
  SearchDetailProps,
  ThemeSearchDetailProps,
  Site,
  Page,
} from '@/types';
import type { FC } from 'react';
import type { ParsedUrlQuery } from 'querystring';

export interface CategoryDetailParams extends ParsedUrlQuery {
  keyword: string;
}

const SearchDetail: FC<SearchDetailProps> = (props) => {
  const { keyword, siteInfo } = props;
  const { t } = useTranslation('nav');

  // 根据页面路径加载不同Layout文件
  const Layout = useLayout() as FC<ThemeSearchDetailProps>;

  const pageMeta: PageMeta = {
    title: `${keyword || ''}${keyword ? ' | ' : ''}${t('search')} | ${siteInfo?.title}`,
    description: siteInfo?.title,
    image: siteInfo?.pageCover,
    slug: 'search/' + (keyword || ''),
    type: 'website',
  };

  return <Layout {...props} pageMeta={pageMeta} />;
};

/**
 * 服务端搜索
 * @param {*} param0
 * @returns
 */
export const getStaticProps: GetStaticProps<
  SearchDetailProps,
  CategoryDetailParams
> = async ({ params, locale }) => {
  const { allPages, ...restProps } = await getSiteData('search-detail-page');
  const { keyword } = params as CategoryDetailParams;
  const allPosts = allPages?.filter(
    (page) => page.type === 'Post' && page.status === 'Published',
  );
  const filteredPosts = await filterByMemCache(allPosts, keyword);
  const posts =
    BLOG.POST_LIST_STYLE === 'page'
      ? filteredPosts.slice(0, BLOG.POSTS_PER_PAGE)
      : filteredPosts;

  return {
    props: {
      ...restProps,
      postCount: posts.length,
      keyword,
      posts,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: BLOG.NEXT_REVALIDATE_SECOND,
  };
};

export const getStaticPaths: GetStaticPaths<
  CategoryDetailParams
> = async () => {
  return {
    paths: [{ params: { keyword: BLOG.TITLE } }],
    fallback: true,
  };
};

function extractTextContent(
  sourceText: string[],
  targetObj: any,
  key: string,
): string[] {
  if (!targetObj) return sourceText;
  const textArray = targetObj[key];
  const text =
    typeof textArray === 'object' ? getTextContent(textArray) : textArray;
  return text && text !== 'Untitled' ? sourceText.concat(text) : sourceText;
}

/**
 * 递归获取层层嵌套的数组
 * @param {*} textArray
 * @returns
 */
function getTextContent(textArray: any): string {
  return Array.isArray(textArray)
    ? textArray.reduce((acc, item) => acc + getTextContent(item), '')
    : typeof textArray === 'string'
      ? textArray
      : '';
}

/**
 * 在内存缓存中进行全文索引
 * @param {*} posts
 * @param keyword 关键词
 * @returns
 */
async function filterByMemCache(posts: Page[], keyword: string) {
  if (!keyword) return [];
  const lowerKeyword = keyword.toLowerCase().trim();
  const filterPosts: Page[] = [];

  posts.forEach(async (post) => {
    const page = await getDataFromCache<Site>(`page_block_${post.id}`, true);
    const tagContent = post?.tags?.join(' ') || '';
    const categoryContent = post?.category || '';
    const articleInfo = (
      post.title +
      post.summary +
      tagContent +
      categoryContent
    ).toLowerCase();

    post.results = [];
    let hit = articleInfo.includes(lowerKeyword);
    let hitCount = 0;

    const indexContent = page ? getPageContentText(post, page) : [];
    for (const content of indexContent) {
      if (!content) continue;
      if (content.toLowerCase().includes(lowerKeyword)) {
        hit = true;
        hitCount += 1;
        post.results.push(content);
      } else if ((post.results.length - 1) / (hitCount || 1) < 3) {
        post.results.push(content);
      }
    }

    if (hit) filterPosts.push(post);
  });
  return filterPosts;
}

export function getPageContentText(post: Page, dataBaseInfo: Site) {
  let indexContent: string[] = [];
  if (dataBaseInfo && dataBaseInfo?.block && !post.password) {
    Object.values(dataBaseInfo.block).forEach((block) => {
      const properties = block.value?.properties;
      indexContent = extractTextContent(indexContent, properties, 'title');
      indexContent = extractTextContent(indexContent, properties, 'caption');
    });
  }
  return indexContent;
}

export default SearchDetail;
