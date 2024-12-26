import { getSiteData } from 'lib/notion/getSiteData';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSiteStore } from 'providers/siteProvider';
import CommonHead from 'components/CommonHead';
import { useEffect, type FC } from 'react';
import ThemeLayout from 'components/ThemeLayout';

import type { PageMeta, SearchIndexProps } from '@/types';
import type { GetStaticProps } from 'next';

/**
 * 搜索路由
 * @param {*} props
 * @returns
 */
const SearchIndex: FC<SearchIndexProps> = (props) => {
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );
  const { t } = useTranslation('nav');

  useEffect(() => {
    updateSiteDataState(props);
  }, [props]);

  const pageMeta: PageMeta = {
    title: `${t('search')} | ${props.siteInfo.title}`,
    description: props.siteInfo.description,
    image: props.siteInfo.pageCover,
    slug: 'search',
    type: 'website',
  };

  return (
    <>
      <CommonHead pageMeta={pageMeta} />
      <ThemeLayout />
    </>
  );
};

export const getStaticProps: GetStaticProps<SearchIndexProps> = async ({
  locale,
}) => {
  const props = await getSiteData('search-props');

  return {
    props: {
      ...props,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: props.config.NEXT_REVALIDATE_SECOND,
  };
};

export default SearchIndex;
