import { getSiteData } from '@/lib/notion/getSiteData';
import { useLayout } from '@/lib/theme';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { omit } from 'lodash';
import { useSiteStore } from '@/providers/siteProvider';
import CommonHead from '@/components/CommonHead';

import type { FC } from 'react';
import type { PageMeta, TagDetailPageProps } from '@/types';
import type { ParsedUrlQuery } from 'querystring';
import type { GetStaticProps, GetStaticPaths } from 'next';

export interface TagDetailPageParams extends ParsedUrlQuery {
  tag: string;
  page: string;
}

const TagDetailPage: FC<TagDetailPageProps> = (props) => {
  const { tag, siteInfo } = props;
  const { t } = useTranslation('common');
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );
  const updateRenderPosts = useSiteStore((state) => state.updateRenderPosts);
  const updateTag = useSiteStore((state) => state.updateTag);

  updateSiteDataState(props);
  updateRenderPosts(props.posts, props.page, props.resultCount);
  updateTag(props.tag);

  // 根据页面路径加载不同Layout文件
  const ThemeLayout = useLayout();

  const pageMeta: PageMeta = {
    title: `${tag} | ${t('tags')} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'tag/' + tag,
    type: 'website',
  };

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
      ...omit(props, 'allPages'),
      posts: paginatedPosts,
      resultCount: filteredPosts.length,
      tag,
      page: pageNumber,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: props.config.NEXT_REVALIDATE_SECOND,
  };
};

export const getStaticPaths: GetStaticPaths<TagDetailPageParams> = async () => {
  const { tagOptions, publishedPosts, config: { POSTS_PER_PAGE } } = await getSiteData(
    'tag-page-static-path',
  );
  const paths: {
    params: TagDetailPageParams;
  }[] = [];
  tagOptions?.forEach((tag) => {
    const tagPosts = publishedPosts.filter((post) =>
      post?.tags?.includes(tag.name),
    );
    const totalPages = Math.ceil(tagPosts.length / POSTS_PER_PAGE);
    for (let i = 1; i < totalPages; i++) {
      paths.push({ params: { tag: tag.name, page: String(i + 1) } });
    }
  });
  return {
    paths: paths,
    fallback: true,
  };
};

export default TagDetailPage;
