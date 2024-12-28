import { getSiteData } from '@/utils/notion/getSiteData';
import { getPostBlocks } from '@/utils/notion/getPostBlocks';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CommonHead from '@/components/CommonHead';
import { useSiteStore } from '@/providers/siteProvider';
import { useConfigStore } from '@/providers/configProvider';
import { omit } from 'lodash';
import ThemeLayout from '@/components/ThemeLayout';

import type { GetStaticProps } from 'next';
import { useEffect, type FC } from 'react';
import type { HomeIndexProps } from '@/types';
import type { Page } from '@/types/notion';

/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const Index: FC<HomeIndexProps> = (props) => {
  const { siteInfo } = props;
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );
  const updateRenderPosts = useSiteStore((state) => state.updateRenderPosts);
  const updateConfig = useConfigStore((state) => state.setConfig);

  useEffect(() => {
    updateSiteDataState(props);
    updateRenderPosts(props.posts, 1, props.publishedPosts.length);
    updateConfig(props.config);
  }, [props]);

  const pageMeta = {
    title: `${siteInfo?.title} | ${siteInfo?.description}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: '',
    type: 'website',
  };

  return (
    <>
      <CommonHead pageMeta={pageMeta} />
      <ThemeLayout />
    </>
  );
};

/**
 * SSG 获取数据
 * @returns
 */
export const getStaticProps: GetStaticProps<HomeIndexProps> = async ({
  locale,
}) => {
  const props = await getSiteData('index');
  const { publishedPosts, config } = props;
  let posts: Page[] = [];

  // 处理分页
  if (config.POST_LIST_STYLE === 'scroll') {
    posts = publishedPosts;
  }

  if (config.POST_LIST_STYLE === 'page') {
    posts = publishedPosts?.slice(0, config.POSTS_PER_PAGE) || [];
  }

  // 预览文章内容
  if (config.POST_LIST_PREVIEW) {
    await Promise.all(
      posts.map(async (post) => {
        if (!post.password) {
          post.blockMap = await getPostBlocks(
            post.id,
            'index-page',
            config.POST_PREVIEW_LINES,
          );
        }
      }),
    );
  }

  return {
    props: {
      ...omit(props, 'allPages'),
      posts,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: config.NEXT_REVALIDATE_SECOND,
  };
};

export default Index;
