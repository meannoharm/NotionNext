import { getSiteData } from '@/utils/notion/getSiteData';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CommonHead from '@/components/CommonHead';
import { useSiteStore } from 'providers/siteProvider';
import { useEffect, type FC } from 'react';
import ThemeLayout from '@/components/ThemeLayout';
import { useTranslation } from 'next-i18next';

import type { PageNotFoundIndexProps, PageMeta } from '@/types';
import type { GetStaticProps } from 'next';
import { useConfigStore } from '@/providers/configProvider';

/**
 * 404
 * @param {*} props
 * @returns
 */
const NoFound: FC<PageNotFoundIndexProps> = (props) => {
  const { t } = useTranslation('common');
  const { siteData, config } = props;
  const { siteInfo } = siteData;
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );
  const updateConfig = useConfigStore((state) => state.setConfig);

  useEffect(() => {
    updateSiteDataState(siteData);
  }, [siteData]);

  useEffect(() => {
    updateConfig(config);
  }, [config]);

  const pageMeta: PageMeta = {
    title: `${siteInfo?.title} | ${t('404_title')}`,
    description: t('404_tips'),
    slug: '',
    type: 'website',
    image: siteInfo?.pageCover,
  };

  return (
    <>
      <CommonHead pageMeta={pageMeta} />
      <ThemeLayout />
    </>
  );
};

export const getStaticProps: GetStaticProps<PageNotFoundIndexProps> = async ({
  locale,
}) => {
  const props = (await getSiteData('404')) || {};
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
        totalPostsCount: props.publishedPosts.length,
      },
      ...(await serverSideTranslations(locale as string)),
    },
  };
};

export default NoFound;
