import { getSiteData } from '@/utils/notion/getSiteData';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSiteStore } from 'providers/siteProvider';
import { useConfigStore } from '@/providers/configProvider';
import CommonHead from '@/components/CommonHead';
import { useEffect, type FC } from 'react';
import ThemeLayout from '@/components/ThemeLayout';
import { useRouter } from 'next/router';
import Loading from '@/components/Loading';

import type { PageMeta, TagDetailProps } from '@/types';
import type { ParsedUrlQuery } from 'querystring';
import type { GetStaticProps, GetStaticPaths } from 'next';

export interface TagIndexParams extends ParsedUrlQuery {
  tag: string;
}

/**
 * 标签下的文章列表
 * @param {*} props
 * @returns
 */
const TagIndex: FC<TagDetailProps> = (props) => {
  const router = useRouter();
  const { tag, siteData, config, posts, resultCount } = props;
  const { siteInfo } = siteData || {};
  const { t } = useTranslation('common');
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );
  const updateRenderPosts = useSiteStore((state) => state.updateRenderPosts);
  const updateTag = useSiteStore((state) => state.updateTag);
  const updateConfig = useConfigStore((state) => state.setConfig);

  useEffect(() => updateSiteDataState(siteData), [siteData]);
  useEffect(() => updateConfig(config), [config]);
  useEffect(() => updateTag(tag), [tag]);
  useEffect(
    () => updateRenderPosts(posts, 1, resultCount),
    [posts, resultCount],
  );

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
  TagDetailProps,
  TagIndexParams
> = async ({ params, locale }) => {
  const { tag } = params as TagIndexParams;
  const props = await getSiteData('tag-props');

  const filteredPosts = props.publishedPosts
    ?.filter((page) => page.type === 'Post' && page.status === 'Published')
    .filter((post) => post && post?.tags && post?.tags.includes(tag));

  const posts =
    props.config.POST_LIST_STYLE === 'page'
      ? filteredPosts.slice(0, props.config.POSTS_PER_PAGE)
      : filteredPosts;

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
      tag,
      posts,
      resultCount: filteredPosts.length,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: props.config.NEXT_REVALIDATE_SECOND,
  };
};

export const getStaticPaths: GetStaticPaths<TagIndexParams> = async ({
  locales = [],
}) => {
  const { tagOptions } = await getSiteData('tag-static-path');

  return {
    paths: locales.flatMap((locale) =>
      tagOptions.map((tag) => ({ params: { tag: tag.name }, locale })),
    ),
    fallback: false,
  };
};

export default TagIndex;
