import { getSiteData } from '@/utils/notion/getSiteData';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSiteStore } from 'providers/siteProvider';
import CommonHead from '@/components/CommonHead';
import ThemeLayout from '@/components/ThemeLayout';
import { useConfigStore } from '@/providers/configProvider';
import { useRouter } from 'next/router';
import { useEffect, type FC } from 'react';
import Loading from '@/components/Loading';

import type { PageMeta, TagDetailPageProps } from '@/types';
import type { ParsedUrlQuery } from 'querystring';
import type { GetStaticProps, GetStaticPaths } from 'next';

export interface TagDetailPageParams extends ParsedUrlQuery {
  tag: string;
  page: string;
}

const TagDetailPage: FC<TagDetailPageProps> = (props) => {
  const { tag, siteData, config, posts, page, resultCount } = props;
  const { siteInfo } = siteData || {};
  const router = useRouter();
  const { t } = useTranslation('common');
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );
  const updateRenderPosts = useSiteStore((state) => state.updateRenderPosts);
  const updateTag = useSiteStore((state) => state.updateTag);
  const updateConfig = useConfigStore((state) => state.setConfig);

  useEffect(() => updateSiteDataState(siteData), [siteData]);
  useEffect(() => updateConfig(config), [config]);
  useEffect(
    () => updateRenderPosts(posts, page, resultCount),
    [posts, page, resultCount],
  );
  useEffect(() => updateTag(tag), [tag]);

  const pageMeta: PageMeta = {
    title: `${tag} | ${t('tags')} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'tag/' + tag,
    type: 'website',
  };

  if (router.isFallback) {
    return <Loading />;
  }

  return (
    <>
      <CommonHead pageMeta={pageMeta} />
      <ThemeLayout />
    </>
  );
};

export const getStaticProps: GetStaticProps<
  TagDetailPageProps,
  TagDetailPageParams
> = async ({ params, locale }) => {
  const { tag, page } = params as TagDetailPageParams;
  const props = await getSiteData('tag-page-props');
  const pageNumber = parseInt(page, 10);

  const filteredPosts = props.publishedPosts.filter((post) =>
    post?.tags?.includes(tag),
  );

  const paginatedPosts = filteredPosts.slice(
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
      posts: paginatedPosts,
      resultCount: filteredPosts.length,
      tag,
      page: pageNumber,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: props.config.NEXT_REVALIDATE_SECOND,
  };
};

export const getStaticPaths: GetStaticPaths<TagDetailPageParams> = async ({
  locales = [],
}) => {
  const {
    tagOptions,
    publishedPosts,
    config: { POSTS_PER_PAGE },
  } = await getSiteData('tag-page-static-path');
  const paths: {
    params: TagDetailPageParams;
    locale: string;
  }[] = [];
  locales.forEach((locale) => {
    tagOptions?.forEach((tag) => {
      const tagPosts = publishedPosts.filter((post) =>
        post?.tags?.includes(tag.name),
      );
      const totalPages = Math.ceil(tagPosts.length / POSTS_PER_PAGE);
      for (let i = 1; i < totalPages; i++) {
        paths.push({ params: { tag: tag.name, page: String(i + 1) }, locale });
      }
    });
  });
  return {
    paths: paths,
    fallback: true,
  };
};

export default TagDetailPage;
