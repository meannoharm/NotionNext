import BLOG from 'blog.config';
import { getSiteData } from '@/lib/notion/getSiteData';
import { getPostBlocks } from '@/lib/notion/getPostBlocks';
import { useLayout } from '@/lib/theme';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import type { GetStaticProps } from 'next';
import type { FC } from 'react';
import type { HomeIndexProps } from '@/types';
import type { Page } from '@/types/notion';
import CommonHead from '@/components/CommonHead';
import { useSiteStore } from '@/providers/siteProvider';
import { omit } from 'lodash';

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

  updateSiteDataState(props);
  updateRenderPosts(props.posts, 1, props.publishedPosts.length);

  const pageMeta = {
    title: `${siteInfo?.title} | ${siteInfo?.description}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: '',
    type: 'website',
  };

  // 根据页面路径加载不同Layout文件
  const Layout = useLayout() as FC;

  return (
    <>
      <CommonHead pageMeta={pageMeta} />
      <Layout />
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
  if (BLOG.POST_LIST_STYLE === 'scroll') {
    posts = publishedPosts;
  }

  if (BLOG.POST_LIST_STYLE === 'page') {
    posts = publishedPosts?.slice(0, config.POSTS_PER_PAGE) || [];
  }

  // 预览文章内容
  if (BLOG.POST_LIST_PREVIEW === 'true') {
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
