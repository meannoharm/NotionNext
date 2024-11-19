import BLOG from 'blog.config';
import { getPostBlocks } from '@/lib/notion/getPostBlocks';
import { getSiteData } from '@/lib/notion/getSiteData';
import { getIndependentPage } from '@/lib/notion/getIndependentPage';
import { getPageTableOfContents } from '@/lib/notion/getPageTableOfContents';
import { useCallback, useEffect, useState } from 'react';
import { idToUuid } from 'notion-utils';
import { useRouter } from 'next/router';
import { useLayout } from '@/lib/theme';
import md5 from 'js-md5';
import { isBrowser } from '@/lib/utils';
import { uploadDataToAlgolia } from '@/lib/algolia';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { PagePropertiesType } from '@/types/notion';

import type { FC } from 'react';
import type { ParsedUrlQuery } from 'querystring';
import type { PageMeta, SlugIndexProps, ThemePrefixProps, Page } from '@/types';
import type { GetStaticProps, GetStaticPaths } from 'next';

export interface SlugIndexParams extends ParsedUrlQuery {
  prefix: string;
}

/**
 * 根据notion的slug访问页面
 * @param {*} props
 * @returns
 */
const Slug: FC<SlugIndexProps> = (props) => {
  const { post, siteInfo } = props;
  const router = useRouter();

  // 文章锁🔐
  const [isLock, setIsLock] = useState<boolean>(!!(post && post.password));

  /**
   * 验证文章密码
   * @param {*} result
   */
  const validPassword = useCallback(
    (passInput: string) => {
      if (!post) {
        return false;
      }
      const encrypt = md5(post.slug + passInput);
      if (passInput && encrypt === post.password) {
        setIsLock(false);
        return true;
      }
      return false;
    },
    [post],
  );

  // 文章加载
  useEffect(() => {
    // 404
    if (!post) {
      setTimeout(() => {
        if (isBrowser) {
          const article = document.getElementById('notion-article');
          if (!article) {
            router.push('/404').then(() => {
              console.warn('找不到页面', router.asPath);
            });
          }
        }
      }, 8 * 1000); // 404时长 8秒
    }

    // 文章加密
    if (post?.password && post?.password !== '') {
      setIsLock(true);
    } else {
      setIsLock(false);
      if (!isLock && post?.blockMap?.block) {
        post.content = Object.keys(post.blockMap.block).filter(
          (key) => post.blockMap?.block[key]?.value?.parent_id === post.id,
        );
        post.toc = getPageTableOfContents(post, post.blockMap);
      }
    }
  }, [post, isLock]);

  const pageMeta: PageMeta = {
    title: post
      ? `${post?.title} | ${siteInfo?.title}`
      : `${props?.siteInfo?.title || BLOG.TITLE} | loading`,
    description: post?.summary || '',
    type: post?.type || '',
    slug: post?.slug || '',
    image:
      post?.pageCoverThumbnail || siteInfo?.pageCover || BLOG.HOME_BANNER_IMAGE,
    category: post?.category?.[0],
    tags: post?.tags,
  };

  // 根据页面路径加载不同Layout文件
  const Layout = useLayout() as FC<ThemePrefixProps>;

  return (
    <Layout
      {...props}
      pageMeta={pageMeta}
      isLock={isLock}
      validPassword={validPassword}
    />
  );
};

export const getStaticPaths: GetStaticPaths<SlugIndexParams> = async () => {
  if (!BLOG.isProd) {
    return {
      paths: [],
      fallback: true,
    };
  }

  const { allPages } = await getSiteData('slug-index');
  return {
    paths: allPages
      .filter(
        (row) => row.slug.indexOf('/') < 0 && row.type.indexOf('Menu') < 0,
      )
      .map((row) => ({ params: { prefix: row.slug } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<
  SlugIndexProps,
  SlugIndexParams
> = async ({ params, locale }) => {
  const { prefix } = params as SlugIndexParams;
  const fullSlug =
    BLOG.PSEUDO_STATIC && !prefix.endsWith('.html') ? `${prefix}.html` : prefix;
  const from = `slug-index-${fullSlug}`;

  const { allPages, ...restProps } = await getSiteData(from);

  // 在列表内查找文章
  let post = allPages.find((p) => {
    return p.slug === fullSlug || p.id === idToUuid(fullSlug);
  });

  // 处理非列表内文章的内信息
  if (!post) {
    const pageId = prefix;
    if (pageId.length >= 32) {
      post = await getIndependentPage(pageId, from);
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

export const findRelatedPosts: (
  post: Page,
  allPosts: Page[],
  count?: number,
) => {
  prev: Page | null;
  next: Page | null;
  recommendPosts: Page[];
} = (post, allPosts, count = 6) => {
  if (!allPosts.length || !post) {
    return { prev: null, next: null, recommendPosts: [] };
  }
  const relatedPosts = allPosts.filter(
    (p) =>
      p.id !== post.id &&
      p.type === PagePropertiesType.Post &&
      post.tags.some((tag) => p.tags.includes(tag)),
  );

  return {
    prev: allPosts[allPosts.indexOf(post) - 1] || allPosts[allPosts.length - 1],
    next: allPosts[allPosts.indexOf(post) + 1] || allPosts[0],
    recommendPosts: relatedPosts.slice(0, count),
  };
};

export default Slug;
