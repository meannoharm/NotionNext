import BLOG from 'blog.config';
import { getPostBlocks } from '@/lib/notion/getPostBlocks';
import { getSiteData } from '@/lib/notion/getSiteData';
import { getIndependentPage } from '@/lib/notion/getIndependentPage';
import { idToUuid } from 'notion-utils';
import Slug, { findRelatedPosts } from '..';
import { uploadDataToAlgolia } from '@/lib/algolia';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import type { FC } from 'react';
import type { ParsedUrlQuery } from 'querystring';
import type { PrefixSlugProps } from '@/types';
import type { GetStaticProps, GetStaticPaths } from 'next';

export interface PrefixSlugParams extends ParsedUrlQuery {
  prefix: string;
  slug: string;
}

/**
 * 根据notion的slug访问页面
 * @param {*} props
 * @returns
 */
const PrefixSlug: FC<PrefixSlugProps> = (props) => {
  return <Slug {...props} />;
};

export const getStaticPaths: GetStaticPaths<PrefixSlugParams> = async () => {
  if (!BLOG.isProd) {
    return {
      paths: [],
      fallback: true,
    };
  }

  const { allPages } = await getSiteData('slug-detail');
  return {
    paths: allPages
      .filter(
        (row) => row.slug.indexOf('/') > 0 && row.type.indexOf('Menu') < 0,
      )
      .map((row) => ({
        params: {
          prefix: row.slug.split('/')[0],
          slug: row.slug.split('/')[1],
        },
      })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<
  PrefixSlugProps,
  PrefixSlugParams
> = async ({ params, locale }) => {
  const { prefix, slug } = params as PrefixSlugParams;
  let fullSlug = `${prefix}/${slug}`;

  if (BLOG.PSEUDO_STATIC && !fullSlug.endsWith('.html')) {
    fullSlug += '.html';
  }

  const from = `slug-detail-${fullSlug}`;
  const { allPages, ...restProps } = await getSiteData(from);

  // 在列表内查找文章
  let post = allPages.find((p) => {
    return p.slug === fullSlug || p.id === idToUuid(fullSlug);
  });

  // 处理非列表内文章的内信息
  if (!post) {
    const pageId = slug.slice(-1)[0];
    if (pageId.length >= 32) {
      post = await getIndependentPage(pageId, fullSlug);
    }
  }

  // 无法获取文章
  if (!post) {
    return {
      props: {
        ...restProps,
        post: null,
        prev: null,
        next: null,
        recommendPosts: [],
        ...(await serverSideTranslations(locale as string)),
      },
      revalidate: BLOG.NEXT_REVALIDATE_SECOND,
    };
  }

  // 文章内容加载
  if (!post.blockMap) {
    post.blockMap = await getPostBlocks(post.id, from);
  }

  // 生成全文索引 && process.env.npm_lifecycle_event === 'build' && JSON.parse(BLOG.ALGOLIA_RECREATE_DATA)
  if (BLOG.ALGOLIA_APP_ID) {
    uploadDataToAlgolia(post);
  }

  // 推荐关联文章处理
  const allPosts = allPages.filter(
    (page) => page.type === 'Post' && page.status === 'Published',
  );
  const { prev, next, recommendPosts } = findRelatedPosts(post, allPosts);

  return {
    props: {
      ...restProps,
      post,
      prev,
      next,
      recommendPosts,
    },
    revalidate: BLOG.NEXT_REVALIDATE_SECOND,
  };
};

export default PrefixSlug;
