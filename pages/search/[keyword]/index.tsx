import { getGlobalData } from '@/lib/notion/getNotionData';
import { getDataFromCache } from '@/lib/cache/cacheManager';
import BLOG from '@/blog.config';
import { useRouter } from 'next/router';
import { getLayoutByTheme } from '@/themes/theme';
import { useTranslation } from 'next-i18next';

import type { GetStaticProps, GetStaticPaths } from 'next';
import type { PageMeta, SearchDetailProps } from '../../types';
import type { FC } from 'react';
import type { ParsedUrlQuery } from 'querystring';
import type { SearchDetailComponent } from '@/themes/types';
import { PageInfo } from '@/lib/notion/types';
import { isIterable } from '@/lib/utils';

export interface CategoryDetailParams extends ParsedUrlQuery {
  keyword: string;
}

const SearchDetail: FC<SearchDetailProps> = (props) => {
  const { keyword, siteInfo } = props;
  const { t } = useTranslation('nav');

  // 根据页面路径加载不同Layout文件
  const Layout = getLayoutByTheme(useRouter()) as SearchDetailComponent;

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
> = async (context) => {
  const { allPages, ...restProps } = await getGlobalData('search-props');
  const { keyword } = context.params as CategoryDetailParams;
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

/**
 * 将对象的指定字段拼接到字符串
 * @param sourceTextArray
 * @param targetObj
 * @param key
 * @returns {*}
 */
function appendText(sourceTextArray, targetObj, key) {
  if (!targetObj) {
    return sourceTextArray;
  }
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
function getTextContent(textArray) {
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
 * @param {*} allPosts
 * @param keyword 关键词
 * @returns
 */
async function filterByMemCache(allPosts: PageInfo[], keyword: string) {
  if (!keyword) return [];
  const lowerKeyword = keyword.toLowerCase().trim();
  const filterPosts: any[] = [];

  for (const post of allPosts) {
    const cacheKey = 'page_block_' + post.id;
    const page = await getDataFromCache(cacheKey, true);
    const tagContent = post?.tags?.join(' ') || '';
    const categoryContent = post?.category || '';
    const articleInfo = (
      post.title +
      post.summary +
      tagContent +
      categoryContent
    ).toLowerCase();

    let hit = articleInfo.includes(lowerKeyword);
    const indexContent = getPageContentText(post, page);

    post.results = [];
    let hitCount = 0;

    for (const content of indexContent) {
      if (!content) continue;
      const lowerContent = content.toLowerCase();
      const index = lowerContent.indexOf(lowerKeyword);
      if (index > -1) {
        hit = true;
        hitCount += 1;
        post.results.push(content);
      } else if ((post.results.length - 1) / (hitCount || 1) < 3) {
        post.results.push(content);
      }
    }

    if (hit) filterPosts.push(post);
  }
  return filterPosts;
}

export function getPageContentText(post: PageInfo, pageBlockMap) {
  let indexContent = [];
  // 防止搜到加密文章的内容
  if (pageBlockMap && pageBlockMap.block && !post.password) {
    const contentIds = Object.keys(pageBlockMap.block);
    contentIds.forEach((id) => {
      const properties = pageBlockMap?.block[id]?.value?.properties;
      indexContent = appendText(indexContent, properties, 'title');
      indexContent = appendText(indexContent, properties, 'caption');
    });
  }
  return indexContent.join('');
}

export default SearchDetail;
