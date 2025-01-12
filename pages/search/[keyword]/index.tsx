import { getSiteData } from '@/utils/notion/getSiteData';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CommonHead from '@/components/CommonHead';
import { useSiteStore } from 'providers/siteProvider';
import getSearchResult from '@/utils/notion/getSearchResult';
import { omit } from 'lodash';
import { useEffect, type FC } from 'react';
import ThemeLayout from '@/components/ThemeLayout';

import type { GetStaticProps } from 'next';
import type { PageMeta, SearchDetailProps } from '@/types';
import type { ParsedUrlQuery } from 'querystring';

export interface SearchDetailParams extends ParsedUrlQuery {
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

  useEffect(() => {
    updateSiteDataState(props);
    updateKeyword(keyword);
    updateRenderPosts(props.posts, 1, props.resultCount);
  }, [props]);

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
  SearchDetailProps,
  SearchDetailParams
> = async ({ params, locale }) => {
  const props = await getSiteData('search-detail-page');
  const { keyword } = params as SearchDetailParams;

  const filteredPosts = await getSearchResult(props.publishedPosts, keyword);
  const posts =
    props.config.POST_LIST_STYLE === 'page'
      ? filteredPosts.slice(0, props.config.POSTS_PER_PAGE)
      : filteredPosts;

  return {
    props: {
      ...omit(props, 'allPages'),
      resultCount: filteredPosts.length,
      keyword,
      posts,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: props.config.NEXT_REVALIDATE_SECOND,
  };
};

export default SearchDetail;
