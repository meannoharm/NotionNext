import { getGlobalData } from '@/lib/notion/getNotionData';
import React from 'react';
import BLOG from 'blog.config';
import { useLayout } from '@/lib/theme';
import { useTranslation } from 'next-i18next';
import { omit } from 'lodash';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import type { FC } from 'react';
import type { PageMeta, CategoryIndexProps, ThemeCategoryProps } from '@/types';
import type { GetStaticProps } from 'next';

/**
 * 分类首页
 * @param {*} props
 * @returns
 */
const Category: FC<CategoryIndexProps> = (props) => {
  const { siteInfo } = props;
  const { t } = useTranslation('common');

  // 根据页面路径加载不同Layout文件
  const Layout = useLayout() as FC<ThemeCategoryProps>;

  const pageMeta: PageMeta = {
    title: `${t('category')} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'category',
    type: 'website',
  };

  return <Layout pageMeta={pageMeta} {...props} />;
};

export const getStaticProps: GetStaticProps<CategoryIndexProps> = async ({
  locale,
}) => {
  const globalData = await getGlobalData('category-index-props');
  return {
    props: {
      ...omit(globalData, 'allPages'),
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: BLOG.NEXT_REVALIDATE_SECOND,
  };
};

export default Category;
