import { getSiteData } from '@/utils/notion/getSiteData';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSiteStore } from 'providers/siteProvider';
import CommonHead from '@/components/CommonHead';
import { useEffect } from 'react';
import ThemeLayout from '@/components/ThemeLayout';
import { useConfigStore } from '@/providers/configProvider';

import type {
  GetStaticProps,
  GetStaticPaths,
  InferGetStaticPropsType,
} from 'next';
import type { PageMeta, CategoryDetailPageProps } from '@/types';
import type { ParsedUrlQuery } from 'querystring';

export interface CategoryDetailPageParams extends ParsedUrlQuery {
  category: string;
  page: string;
}

/**
 * 分类页
 * @param {*} props
 * @returns
 */

const CategoryDetailPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const { siteData, config, posts, resultCount, category, page } = props;
  const { siteInfo } = siteData || {};
  const { t } = useTranslation('nav');
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );
  const updateRenderPosts = useSiteStore((state) => state.updateRenderPosts);
  const updateCategory = useSiteStore((state) => state.updateCategory);
  const updateConfig = useConfigStore((state) => state.setConfig);

  useEffect(() => updateSiteDataState(siteData), [siteData]);
  useEffect(() => updateConfig(config), [config]);
  useEffect(
    () => updateRenderPosts(posts, page, resultCount),
    [posts, resultCount],
  );
  useEffect(() => updateCategory(category), [category]);

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
      <ThemeLayout />
    </>
  );
};

export const getStaticProps = (async ({ params, locale }) => {
  const { category, page } = params as CategoryDetailPageParams;
  const pageNumber = parseInt(page, 10);
  const props = await getSiteData('category-page-props');

  // 过滤状态类型
  const filteredPosts = props.publishedPosts?.filter((post) =>
    post.category?.includes(category),
  );

  const posts = filteredPosts.slice(
    props.config.POSTS_PER_PAGE * (pageNumber - 1),
    props.config.POSTS_PER_PAGE * pageNumber,
  );

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
      resultCount: filteredPosts.length,
      category,
      page: pageNumber,
      posts,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: props.config.NEXT_REVALIDATE_SECOND,
  };
}) satisfies GetStaticProps<CategoryDetailPageProps, CategoryDetailPageParams>;

export const getStaticPaths = (async ({ locales = [] }) => {
  const { categoryOptions, publishedPosts, config } =
    await getSiteData('category-paths');
  const paths: { params: CategoryDetailPageParams; locale: string }[] = [];

  locales.forEach((locale) => {
    categoryOptions?.forEach((category) => {
      // 只处理发布状态的文章
      const categoryPosts = publishedPosts?.filter((post) =>
        post.category?.includes(category.name),
      );
      const totalPages = Math.ceil(
        categoryPosts.length / config.POSTS_PER_PAGE,
      );
      for (let i = 1; i < totalPages; i++) {
        paths.push({
          params: { category: category.name, page: String(i + 1) },
          locale,
        });
      }
    });
  });

  return {
    paths,
    fallback: 'blocking',
  };
}) as GetStaticPaths<CategoryDetailPageParams>;

export default CategoryDetailPage;
