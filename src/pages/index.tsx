import BLOG from 'blog.config';
import { getSiteData } from '@/lib/notion/getSiteData';
import { getPostBlocks } from '@/lib/notion/getPostBlocks';
import { generateRss } from '@/lib/rss';
import { generateRobotsTxt } from '@/lib/robots.txt';
import { useLayout } from '@/lib/theme';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import type { GetStaticProps } from 'next';
import type { FC } from 'react';
import type { HomeIndexProps, ThemeHomeProps } from '@/types';
import type { Page } from '@/types/notion';

/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const Index: FC<HomeIndexProps> = (props) => {
  // 根据页面路径加载不同Layout文件
  const Layout = useLayout() as FC<ThemeHomeProps>;
  return <Layout {...props} />;
};

/**
 * SSG 获取数据
 * @returns
 */
export const getStaticProps: GetStaticProps<HomeIndexProps> = async ({
  locale,
}) => {
  const globalData = await getSiteData('index');
  const { siteInfo, publishedPosts, config } = globalData;
  let posts: Page[] = [];

  const pageMeta = {
    title: `${siteInfo?.title} | ${siteInfo?.description}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: '',
    type: 'website',
  };

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

  // 生成robotTxt
  generateRobotsTxt();

  // 生成Feed订阅
  if (BLOG.ENABLE_RSS) {
    generateRss(globalData.latestPosts);
  }

  return {
    props: {
      ...globalData,
      pageMeta,
      posts,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: config.NEXT_REVALIDATE_SECOND,
  };
};

export default Index;
