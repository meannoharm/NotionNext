import { getSiteData } from '@/lib/notion/getSiteData';
import React from 'react';
import BLOG from 'blog.config';
import { useLayout } from '@/lib/theme';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSiteStore } from '@/providers/siteProvider';
import CommonHead from '@/components/CommonHead';
import { omit } from 'lodash';

import type { GetStaticProps, GetStaticPaths } from 'next';
import type { PageMeta, CategoryPageProps } from '@/types';
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
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );
  const updateRenderPosts = useSiteStore((state) => state.updateRenderPosts);
  const updateCategory = useSiteStore((state) => state.updateCategory);

  updateSiteDataState(props);
  updateRenderPosts(props.posts, props.page, props.resultCount);
  updateCategory(props.category);

  // 根据页面路径加载不同Layout文件
  const Layout = useLayout();

  const pageMeta: PageMeta = {
    title: `${props.category} | ${t('category')} | ${siteInfo?.title || ''}`,
    description: siteInfo?.description,
    slug: 'category/' + props.category,
    image: siteInfo?.pageCover,
    type: 'website',
  };

  return (
    <>
      <CommonHead pageMeta={pageMeta} />
      <Layout />
    </>
  );
};

export const getStaticProps: GetStaticProps<
  CategoryPageProps,
  CategoryPageParams
> = async ({ params, locale }) => {
  const { category, page } = params as CategoryPageParams;
  const pageNumber = parseInt(page, 10);
  const props = await getSiteData('category-page-props');

  // 过滤状态类型
  const filteredPosts = props.publishedPosts?.filter((post) =>
    post.category?.includes(category),
  );

  const posts = filteredPosts.slice(
    BLOG.POSTS_PER_PAGE * (pageNumber - 1),
    BLOG.POSTS_PER_PAGE * pageNumber,
  );

  return {
    props: {
      ...omit(props, 'allPages'),
      resultCount: filteredPosts.length,
      category,
      page: pageNumber,
      posts,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: BLOG.NEXT_REVALIDATE_SECOND,
  };
};

export const getStaticPaths: GetStaticPaths<CategoryPageParams> = async () => {
  const { categoryOptions, publishedPosts } =
    await getSiteData('category-paths');
  const paths: { params: CategoryPageParams }[] = [];

  categoryOptions?.forEach((category) => {
    // 只处理发布状态的文章
    const categoryPosts = publishedPosts?.filter((post) =>
      post.category?.includes(category.name),
    );
    const totalPages = Math.ceil(categoryPosts.length / BLOG.POSTS_PER_PAGE);
    for (let i = 1; i < totalPages; i++) {
      paths.push({ params: { category: category.name, page: String(i + 1) } });
    }
  });

  return {
    paths,
    fallback: true,
  };
};

export default CategoryPage;
