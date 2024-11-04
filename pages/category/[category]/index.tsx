import { getGlobalData } from '@/lib/notion/getNotionData';
import React from 'react';
import BLOG from '@/blog.config';
import { useRouter } from 'next/router';
import { getLayoutByTheme } from '@/themes/theme';
import { useTranslation } from 'next-i18next';
import { omit } from 'lodash';
import { PageInfo } from '@/lib/notion/types';

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
export const Category: FC<CategoryDetailProps> = (props) => {
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
  const props = await getGlobalData('category-props');

  let posts: PageInfo[] = props.allPages?.filter(
    (page) =>
      page.type === 'Post' &&
      page.status === 'Published' &&
      page.category &&
      page.category.includes(category),
  );
  // 处理文章页数
  const postCount = posts.length;
  // 处理分页
  if (BLOG.POST_LIST_STYLE === 'scroll') {
    // 滚动列表 给前端返回所有数据
  } else if (BLOG.POST_LIST_STYLE === 'page') {
    posts = posts?.slice(0, BLOG.POSTS_PER_PAGE) || [];
  }

  return {
    props: {
      ...omit(props, 'allPages'),
      category,
      posts,
      postCount,
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
