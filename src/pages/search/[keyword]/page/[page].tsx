import { getSiteData } from '@/lib/notion/getSiteData';
import BLOG from 'blog.config';
import { useLayout } from '@/lib/theme';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSiteStore } from '@/providers/siteProvider';
import CommonHead from '@/components/CommonHead';
import getSearchResult from '@/lib/notion/getSearchResult';

import type { FC } from 'react';
import type { PageMeta, SearchPageProps } from '@/types';
import type { ParsedUrlQuery } from 'querystring';
import type { GetStaticProps } from 'next';

export interface SearchPageParams extends ParsedUrlQuery {
  keyword: string;
  page: string;
}

const SearchPage: FC<SearchPageProps> = (props) => {
  const { keyword, siteInfo } = props;
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );
  const updateKeyword = useSiteStore((state) => state.updateKeyword);
  const updateRenderPosts = useSiteStore((state) => state.updateRenderPosts);
  const { t } = useTranslation('nav');

  updateSiteDataState(props);
  updateKeyword(keyword);
  updateRenderPosts(props.posts, props.page, props.resultCount);

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
  const { allPages, ...restProps } = await getSiteData('search-props');
  const pageNumber = parseInt(page, 10);
  const filteredPosts = allPages?.filter(
    (page) => page.type === 'Post' && page.status === 'Published',
  );
  const posts = (await getSearchResult(filteredPosts, keyword)).slice(
    BLOG.POSTS_PER_PAGE * (pageNumber - 1),
    BLOG.POSTS_PER_PAGE * pageNumber,
  );
  return {
    props: {
      ...restProps,
      posts,
      resultCount: filteredPosts.length,
      page: pageNumber,
      keyword,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: BLOG.NEXT_REVALIDATE_SECOND,
  };
};

export default SearchPage;
