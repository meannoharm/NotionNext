import { getGlobalData } from '@/lib/notion/getNotionData';
import { getDataFromCache } from '@/lib/cache/cacheManager';
import BLOG from '@/blog.config';
import { useLayout } from '@/theme';
import { useTranslation } from 'next-i18next';
import { isIterable } from '@/lib/utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import type { FC } from 'react';
import type { PageMeta, SearchPageProps, ThemeSearchPageProps } from '@/types';
import type { ParsedUrlQuery } from 'querystring';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { DataBaseInfo, PageInfo } from '@/lib/notion/types';

export interface SearchPageParams extends ParsedUrlQuery {
  keyword: string;
  page: string;
}

const SearchPage: FC<SearchPageProps> = (props) => {
  const { keyword, siteInfo } = props;
  const { t } = useTranslation('nav');

  // 根据页面路径加载不同Layout文件
  const Layout = useLayout() as FC<ThemeSearchPageProps>;

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
  SearchPageProps,
  SearchPageParams
> = async ({ params, locale }) => {
  const { keyword, page } = params as SearchPageParams;
  const { allPages, ...restProps } = await getGlobalData('search-props');
  const pageNumber = parseInt(page, 10);
  const filteredPosts = allPages?.filter(
    (page) => page.type === 'Post' && page.status === 'Published',
  );
  const posts = (await filterByMemCache(filteredPosts, keyword)).slice(
    BLOG.POSTS_PER_PAGE * (pageNumber - 1),
    BLOG.POSTS_PER_PAGE * pageNumber,
  );
  return {
    props: {
      ...restProps,
      posts,
      postCount: posts.length,
      page: pageNumber,
      keyword,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: BLOG.NEXT_REVALIDATE_SECOND,
  };
};

export const getStaticPaths: GetStaticPaths<SearchPageParams> = () => {
  return {
    paths: [{ params: { keyword: BLOG.TITLE, page: '1' } }],
    fallback: true,
  };
};

/**
 * 将对象的指定字段拼接到字符串
 * @param sourceTextArray
 * @param targetObj
 * @param key
 * @returns {*}
 */
function appendText(sourceTextArray: string[], targetObj: any, key: string) {
  if (!targetObj) return sourceTextArray;
  const textArray = targetObj[key];
  const text = textArray ? getTextContent(textArray) : '';
  if (text && text !== 'Untitled') {
    return sourceTextArray.concat(text);
  }
  return sourceTextArray;
}

/**
 * 递归获取层层嵌套的数组
 * @param {*} textArray
 * @returns
 */
function getTextContent(textArray: any) {
  if (typeof textArray === 'object' && isIterable(textArray)) {
    let result = '';
    for (const textObj of textArray) {
      result = result + getTextContent(textObj);
    }
    return result;
  } else if (typeof textArray === 'string') {
    return textArray;
  }
}

/**
 * 在内存缓存中进行全文索引
 * @param {*} posts
 * @param keyword 关键词
 * @returns
 */
async function filterByMemCache(posts: PageInfo[], keyword: string) {
  if (!keyword) return [];
  const lowerKeyword = keyword.toLowerCase().trim();
  const filterPosts: PageInfo[] = [];

  posts.forEach(async (post) => {
    const page = await getDataFromCache<DataBaseInfo>(
      `page_block_${post.id}`,
      true,
    );
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

    let indexContent = [post.summary];
    if (page && page.block) {
      Object.values(page.block).forEach((block) => {
        const properties = block.value.properties;
        indexContent = appendText(indexContent, properties, 'title');
        indexContent = appendText(indexContent, properties, 'caption');
      });
    }

    indexContent.forEach((content, index) => {
      if (content && post.results) {
        if (content.toLowerCase().includes(lowerKeyword)) {
          hit = true;
          hitCount += 1;
          post.results.push(content);
        } else if ((post.results.length - 1) / hitCount < 3 || index === 0) {
          post.results.push(content);
        }
      }
    });

    if (hit) {
      filterPosts.push(post);
    }
  });
  return filterPosts;
}

export default SearchPage;
