import { getSiteData } from '@/utils/notion/getSiteData';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSiteStore } from 'providers/siteProvider';
import CommonHead from '@/components/CommonHead';
import { useEffect, type FC } from 'react';
import ThemeLayout from '@/components/ThemeLayout';
import { useConfigStore } from '@/providers/configProvider';

import type { PageMeta, SearchIndexProps } from '@/types';
import type { GetStaticProps } from 'next';

/**
 * 搜索路由
 * @param {*} props
 * @returns
 */
const SearchIndex: FC<SearchIndexProps> = (props) => {
  const { siteData, config } = props;
  const { siteInfo } = siteData;
  const { t } = useTranslation('common');
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );
  const updateConfig = useConfigStore((state) => state.setConfig);

  useEffect(() => updateSiteDataState(siteData), [siteData]);
  useEffect(() => updateConfig(config), [config]);

  const pageMeta: PageMeta = {
    title: `${t('search')} | ${siteInfo.title}`,
    description: siteInfo.description,
    image: siteInfo.pageCover,
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
      config: props.config,
      siteData: {
        notice: props.notice,
        siteInfo: props.siteInfo,
        tagOptions: props.tagOptions,
        categoryOptions: props.categoryOptions,
        navList: props.navList,
        latestPosts: props.latestPosts,
      },
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: props.config.NEXT_REVALIDATE_SECOND,
  };
};

export default SearchIndex;
