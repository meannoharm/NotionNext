import { getSiteData } from '@/utils/notion/getSiteData';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSiteStore } from 'providers/siteProvider';
import CommonHead from '@/components/CommonHead';
import { useEffect, type FC } from 'react';
import ThemeLayout from '@/components/ThemeLayout';
import { useConfigStore } from '@/providers/configProvider';

import type { PageMeta, CategoryIndexProps } from '@/types';
import type { GetStaticProps } from 'next';

/**
 * 分类首页
 * @param {*} props
 * @returns
 */
const Category: FC<CategoryIndexProps> = (props) => {
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
    title: `${t('category')} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'category',
    type: 'website',
  };

  return (
    <>
      <CommonHead pageMeta={pageMeta} />
      <ThemeLayout />
    </>
  );
};

export const getStaticProps: GetStaticProps<CategoryIndexProps> = async ({
  locale,
}) => {
  const globalData = await getSiteData('category-index-props');
  return {
    props: {
      config: globalData.config,
      siteData: {
        notice: globalData.notice,
        siteInfo: globalData.siteInfo,
        tagOptions: globalData.tagOptions,
        categoryOptions: globalData.categoryOptions,
        navList: globalData.navList,
        latestPosts: globalData.latestPosts,
        totalPostsCount: globalData.publishedPosts.length,
      },
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: globalData.config.NEXT_REVALIDATE_SECOND,
  };
};

export default Category;
