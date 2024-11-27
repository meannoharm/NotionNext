import { getSiteData } from '@/lib/notion/getSiteData';
import BLOG from 'blog.config';
import { useLayout } from '@/lib/theme';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { omit } from 'lodash';
import { useSiteStore } from '@/providers/siteProvider';
import CommonHead from '@/components/CommonHead';

import type { FC } from 'react';
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
  const { tag, siteInfo } = props;
  const { t } = useTranslation('common');
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );
  const updateRenderPosts = useSiteStore((state) => state.updateRenderPosts);
  const updateTag = useSiteStore((state) => state.updateTag);

  updateSiteDataState(props);
  updateRenderPosts(props.posts, 1, props.resultCount);
  updateTag(tag);

  // 根据页面路径加载不同Layout文件
  const Layout = useLayout();

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
      <Layout />
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
    BLOG.POST_LIST_STYLE === 'page'
      ? filteredPosts.slice(0, BLOG.POSTS_PER_PAGE)
      : filteredPosts;

  return {
    props: {
      ...omit(props, 'allPages'),
      tag,
      posts,
      resultCount: filteredPosts.length,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: BLOG.NEXT_REVALIDATE_SECOND,
  };
};

export const getStaticPaths: GetStaticPaths<TagIndexParams> = async () => {
  const { tagOptions } = await getSiteData('tag-static-path');

  return {
    paths: tagOptions.map((tag) => ({ params: { tag: tag.name } })),
    fallback: true,
  };
};

export default TagIndex;
