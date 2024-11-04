import { getGlobalData } from '@/lib/notion/getNotionData';
import React from 'react';
import BLOG from '@/blog.config';
import { useRouter } from 'next/router';
import { getLayoutByTheme } from '@/themes/theme';
import { useTranslation } from 'next-i18next';

import type { GetStaticProps, GetStaticPaths } from 'next';
import type { PageMeta, CategoryDetailProps } from '../../types';
import type { FC } from 'react';
import type { ParsedUrlQuery } from 'querystring';
import type { CategoryDetailComponent } from '@/themes/types';

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
  const Layout = getLayoutByTheme(useRouter()) as CategoryDetailComponent;

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
> = async (context) => {
  const { category } = context.params as CategoryDetailParams;
  const { allPages, ...globalProps } = await getGlobalData('category-props');

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
