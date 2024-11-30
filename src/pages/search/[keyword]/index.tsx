import { getSiteData } from '@/lib/notion/getSiteData';
import BLOG from 'blog.config';
import { useLayout } from '@/lib/theme';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CommonHead from '@/components/CommonHead';
import { useSiteStore } from '@/providers/siteProvider';
import getSearchResult from '@/lib/notion/getSearchResult';

import type { GetStaticProps } from 'next';
import type { PageMeta, SearchDetailProps } from '@/types';
import type { FC } from 'react';
import type { ParsedUrlQuery } from 'querystring';

export interface CategoryDetailParams extends ParsedUrlQuery {
  keyword: string;
}

const SearchDetail: FC<SearchDetailProps> = (props) => {
  const { keyword, siteInfo } = props;
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );
  const updateKeyword = useSiteStore((state) => state.updateKeyword);
  const updateRenderPosts = useSiteStore((state) => state.updateRenderPosts);
  const { t } = useTranslation('nav');

  updateSiteDataState(props);
  updateKeyword(keyword);
  updateRenderPosts(props.posts, 1, props.resultCount);

  // 根据页面路径加载不同Layout文件
  const Layout = useLayout();

  const pageMeta: PageMeta = {
    title: `${keyword || ''}${keyword ? ' | ' : ''}${t('search')} | ${siteInfo?.title}`,
    description: siteInfo?.title,
    image: siteInfo?.pageCover,
    slug: 'search/' + (keyword || ''),
    type: 'website',
  };

  return (
    <>
      <CommonHead pageMeta={pageMeta} />
      <Layout />
    </>
  );
};

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
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
  const filteredPosts = await getSearchResult(allPosts, keyword);
  const posts =
    BLOG.POST_LIST_STYLE === 'page'
      ? filteredPosts.slice(0, BLOG.POSTS_PER_PAGE)
      : filteredPosts;

  return {
    props: {
      ...restProps,
      resultCount: filteredPosts.length,
      keyword,
      posts,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: BLOG.NEXT_REVALIDATE_SECOND,
  };
};

export default SearchDetail;
