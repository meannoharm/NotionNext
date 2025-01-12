import { getSiteData } from '@/utils/notion/getSiteData';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSiteStore } from 'providers/siteProvider';
import CommonHead from '@/components/CommonHead';
import { useEffect } from 'react';
import ThemeLayout from '@/components/ThemeLayout';

import type { FC } from 'react';
import type { PageMeta, TagIndexProps } from '@/types';
import type { GetStaticProps } from 'next';
import { useConfigStore } from '@/providers/configProvider';

/**
 * 标签首页
 * @param {*} props
 * @returns
 */
const TagIndex: FC<TagIndexProps> = (props) => {
  const { siteData, config } = props;
  const { siteInfo } = siteData;

  const { t } = useTranslation('common');
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );
  const updateConfig = useConfigStore((state) => state.setConfig);

  useEffect(() => {
    updateSiteDataState(siteData);
  }, [siteData]);
  useEffect(() => updateConfig(config), [config]);

  const pageMeta: PageMeta = {
    title: `${t('tags')} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'tag',
    type: 'website',
  };

  return (
    <>
      <CommonHead pageMeta={pageMeta} />
      <ThemeLayout />
    </>
  );
};

export const getStaticProps: GetStaticProps<TagIndexProps> = async ({
  locale,
}) => {
  const props = await getSiteData('tag-index-props');
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
    revalidate: props.config.NEXT_REVALIDATE_SECOND,
  };
};

export default TagIndex;
