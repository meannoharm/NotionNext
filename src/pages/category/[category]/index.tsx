import { getGlobalData } from '@/lib/notion/getNotionData';
import React from 'react';
import BLOG from 'blog.config';
import { useLayout } from '@/lib/theme';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import type { GetStaticProps, GetStaticPaths } from 'next';
import type {
  PageMeta,
  CategoryDetailProps,
  ThemeCategoryDetailProps,
} from '@/types';
import type { FC } from 'react';
import type { ParsedUrlQuery } from 'querystring';

export interface CategoryDetailParams extends ParsedUrlQuery {
  category: string;
}

/**
 * 分类页
 * @param {*} props
 * @returns
 */
const CategoryDetail: FC<CategoryDetailProps> = (props) => {
  const { siteInfo } = props;
  const { t } = useTranslation('common');

  // 根据页面路径加载不同Layout文件
  const Layout = useLayout() as FC<ThemeCategoryDetailProps>;

  const pageMeta: PageMeta = {
    title: `${props.category} | ${t('category')} | ${siteInfo?.title || ''}`,
    description: siteInfo?.description,
    slug: 'category/' + props.category,
    image: siteInfo?.pageCover,
    type: 'website',
  };

  return <Layout pageMeta={pageMeta} {...props} />;
};

export const getStaticProps: GetStaticProps<
  CategoryDetailProps,
  CategoryDetailParams
> = async ({ params, locale }) => {
  const { category } = params as CategoryDetailParams;
  const { allPages, ...globalProps } = await getGlobalData(
    'category-detail-props',
  );

  const filteredPosts = allPages.filter(
    (page) =>
      page.type === 'Post' &&
      page.status === 'Published' &&
      page.category?.includes(category),
  );
  const posts =
    BLOG.POST_LIST_STYLE === 'page'
      ? filteredPosts.slice(0, BLOG.POSTS_PER_PAGE)
      : filteredPosts;

  return {
    props: {
      ...globalProps,
      category,
      posts,
      postCount: posts.length,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: BLOG.NEXT_REVALIDATE_SECOND,
  };
};

export const getStaticPaths: GetStaticPaths<
  CategoryDetailParams
> = async () => {
  const from = 'category-paths';
  const { categoryOptions } = await getGlobalData(from);
  return {
    paths: categoryOptions.map((category) => ({
      params: { category: category.name },
    })),
    fallback: true,
  };
};

export default CategoryDetail;
