import { getSiteData } from '@/lib/notion/getSiteData';
import React from 'react';
import BLOG from 'blog.config';
import { useLayout } from '@/lib/theme';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import type { GetStaticProps, GetStaticPaths } from 'next';
import type {
  PageMeta,
  CategoryPageProps,
  ThemeCategoryPageProps,
} from '@/types';
import type { FC } from 'react';
import type { ParsedUrlQuery } from 'querystring';

export interface CategoryPageParams extends ParsedUrlQuery {
  category: string;
  page: string;
}

/**
 * 分类页
 * @param {*} props
 * @returns
 */

const CategoryPage: FC<CategoryPageProps> = (props) => {
  const { siteInfo } = props;
  const { t } = useTranslation('common');
  // 根据页面路径加载不同Layout文件
  const Layout = useLayout() as FC<ThemeCategoryPageProps>;

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
  CategoryPageProps,
  CategoryPageParams
> = async ({ params, locale }) => {
  const { category, page } = params as CategoryPageParams;
  const pageNumber = parseInt(page, 10);
  const { allPages, ...globalProps } = await getSiteData('category-page-props');

  // 过滤状态类型
  const posts = allPages
    ?.filter(
      (post) =>
        post.type === 'Post' &&
        post.status === 'Published' &&
        post.category?.includes(category),
    )
    .slice(
      BLOG.POSTS_PER_PAGE * (pageNumber - 1),
      BLOG.POSTS_PER_PAGE * pageNumber,
    );

  return {
    props: {
      ...globalProps,
      postCount: posts.length,
      category,
      page: pageNumber,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: BLOG.NEXT_REVALIDATE_SECOND,
  };
};

export const getStaticPaths: GetStaticPaths<CategoryPageParams> = async () => {
  const { categoryOptions, allPages } = await getSiteData('category-paths');
  const paths: { params: CategoryPageParams }[] = [];

  categoryOptions?.forEach((category) => {
    // 只处理发布状态的文章
    const categoryPosts = allPages?.filter(
      (post) =>
        post.type === 'Post' &&
        post.status === 'Published' &&
        post.category?.includes(category.name),
    );

    const totalPages = Math.ceil(categoryPosts.length / BLOG.POSTS_PER_PAGE);
    for (let i = 1; i <= totalPages; i++) {
      paths.push({ params: { category: category.name, page: String(i) } });
    }
  });

  return {
    paths,
    fallback: true,
  };
};

export default CategoryPage;
