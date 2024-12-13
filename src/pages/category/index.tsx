import { getSiteData } from '@/lib/notion/getSiteData';
import { useLayout } from '@/lib/theme';
import { useTranslation } from 'next-i18next';
import { omit } from 'lodash';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSiteStore } from '@/providers/siteProvider';
import CommonHead from '@/components/CommonHead';

import type { FC } from 'react';
import type { PageMeta, CategoryIndexProps } from '@/types';
import type { GetStaticProps } from 'next';

/**
 * 分类首页
 * @param {*} props
 * @returns
 */
const Category: FC<CategoryIndexProps> = (props) => {
  const { siteInfo } = props;
  const { t } = useTranslation('common');
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );

  updateSiteDataState(props);

  // 根据页面路径加载不同Layout文件
  const ThemeLayout = useLayout();

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
      ...omit(globalData, 'allPages'),
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: globalData.config.NEXT_REVALIDATE_SECOND,
  };
};

export default Category;
