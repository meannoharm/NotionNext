import { getSiteData } from '@/utils/notion/getSiteData';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSiteStore } from 'providers/siteProvider';
import { useConfigStore } from '@/providers/configProvider';
import CommonHead from '@/components/CommonHead';
import getSearchResult from '@/utils/notion/getSearchResult';
import { useEffect, type FC } from 'react';
import ThemeLayout from '@/components/ThemeLayout';

import type { PageMeta, SearchDetailPageProps } from '@/types';
import type { ParsedUrlQuery } from 'querystring';
import type { GetStaticProps } from 'next';

export interface SearchDetailPageParams extends ParsedUrlQuery {
  keyword: string;
  page: string;
}

const SearchDetailPage: FC<SearchDetailPageProps> = (props) => {
  const { keyword, siteData, config, posts, page, resultCount } = props;
  const { siteInfo } = siteData;
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );
  const updateKeyword = useSiteStore((state) => state.updateKeyword);
  const updateRenderPosts = useSiteStore((state) => state.updateRenderPosts);
  const updateConfig = useConfigStore((state) => state.setConfig);
  const { t } = useTranslation('nav');

  useEffect(() => updateSiteDataState(siteData), [siteData]);
  useEffect(() => updateConfig(config), [config]);
  useEffect(() => updateKeyword(keyword), [keyword]);
  useEffect(() => updateRenderPosts(posts, page, resultCount), [posts, page, resultCount]);

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
      <ThemeLayout />
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
  SearchDetailPageProps,
  SearchDetailPageParams
> = async ({ params, locale }) => {
  const { keyword, page } = params as SearchDetailPageParams;
  const props = await getSiteData('search-detail-page');

  const pageNumber = parseInt(page, 10);
  const filteredPosts = await getSearchResult(props.publishedPosts, keyword);
  const posts = filteredPosts.slice(
    props.config.POSTS_PER_PAGE * (pageNumber - 1),
    props.config.POSTS_PER_PAGE * pageNumber,
  );
  return {
    props: {
      config: props.config,
      siteData: {
        notice: props.notice,
        siteInfo: props.siteInfo,
        tagOptions: props.tagOptions,
        categoryOptions: props.categoryOptions,
        navList: props.navList,
        latestPosts: props.latestPosts,
      },
      posts,
      resultCount: filteredPosts.length,
      page: pageNumber,
      keyword,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: props.config.NEXT_REVALIDATE_SECOND,
  };
};

export default SearchDetailPage;
