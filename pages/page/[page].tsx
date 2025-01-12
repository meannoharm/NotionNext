import { getSiteData } from '@/utils/notion/getSiteData';
import { getPostBlocks } from '@/utils/notion/getPostBlocks';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CommonHead from '@/components/CommonHead';
import { useSiteStore } from 'providers/siteProvider';
import { useEffect, type FC } from 'react';
import ThemeLayout from 'components/ThemeLayout';
import { useConfigStore } from '@/providers/configProvider';

import type { GetStaticProps, GetStaticPaths } from 'next';
import type { PageMeta, PageIndexProps } from '@/types';
import type { ParsedUrlQuery } from 'querystring';

export interface PageParams extends ParsedUrlQuery {
  page: string;
}

/**
 * 文章列表分页
 * @param {*} props
 * @returns
 */
const Page: FC<PageIndexProps> = (props) => {
  const { siteData, page, posts, publishedPostsCount, config } = props;
  const { siteInfo } = siteData;
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );
  const updateRenderPosts = useSiteStore((state) => state.updateRenderPosts);
  const updateConfig = useConfigStore((state) => state.setConfig);

  useEffect(() => updateSiteDataState(siteData), [siteData]);
  useEffect(
    () => updateRenderPosts(posts, page, publishedPostsCount),
    [posts, page, publishedPostsCount],
  );
  useEffect(() => updateConfig(config), [config]);

  const pageMeta: PageMeta = {
    title: `${props?.page} | Page | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'page/' + props.page,
    type: 'website',
  };

  return (
    <>
      <CommonHead pageMeta={pageMeta} />
      <ThemeLayout />
    </>
  );
};

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  const from = 'page-paths';
  const { publishedPosts, config } = await getSiteData(from);
  const totalPages = Math.ceil(publishedPosts.length / config.POSTS_PER_PAGE);
  return {
    // 生成每一页的路径
    paths: Array.from({ length: totalPages }, (_, i) => ({
      params: { page: String(i + 1) },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<
  PageIndexProps,
  PageParams
> = async ({ params, locale }) => {
  const { page } = params as PageParams;
  const pageNumber = parseInt(page, 10);
  const props = await getSiteData(`page-${pageNumber}`);

  // 处理分页
  const posts = props.publishedPosts.slice(
    props.config.POSTS_PER_PAGE * (pageNumber - 1),
    props.config.POSTS_PER_PAGE * pageNumber,
  );

  // 处理预览
  if (props.config.POST_LIST_PREVIEW) {
    await Promise.all(
      posts.map(async (post) => {
        if (!post.password) {
          post.blockMap = await getPostBlocks(
            post.id,
            'slug',
            props.config.POST_PREVIEW_LINES,
          );
        }
      }),
    );
  }

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
      },
      posts,
      publishedPostsCount: props.publishedPosts.length,
      page: pageNumber,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: props.config.NEXT_REVALIDATE_SECOND,
  };
};

export default Page;
