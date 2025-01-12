import { getPostBlocks } from '@/utils/notion/getPostBlocks';
import { getSiteData } from '@/utils/notion/getSiteData';
import { getPageTableOfContents } from '@/utils/notion/getPageTableOfContents';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isBrowser, isProduct, isUUID } from '@/utils';
import { uploadDataToAlgolia } from '@/utils/algolia';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getIndependentPage } from '@/utils/notion/getIndependentPage';
import CommonHead from '@/components/CommonHead';
import { useSiteStore } from 'providers/siteProvider';
import { ALGOLIA_APPLICATION_ID } from '@/constants';
import ThemeLayout from '@/components/ThemeLayout';
import { useConfigStore } from 'providers/configProvider';

import type { FC } from 'react';
import type { ParsedUrlQuery } from 'querystring';
import type { PageMeta, ArticleProps } from '@/types';
import type { GetStaticProps, GetStaticPaths } from 'next';

export interface PrefixParams extends ParsedUrlQuery {
  slug: string[];
}

/**
 * 根据notion的slug访问页面
 * @param {*} props
 * @returns
 */
const Slug: FC<ArticleProps> = (props) => {
  const { post, siteInfo } = props;
  const router = useRouter();
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );
  const updatePost = useSiteStore((state) => state.updatePost);
  const updateConfig = useConfigStore((state) => state.setConfig);

  useEffect(() => {
    updateSiteDataState(props);
    updatePost(post);
    updateConfig(props.config);
  }, [props]);

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
  }, [post]);

  const pageMeta: PageMeta = {
    title: post
      ? `${post?.title} | ${siteInfo?.title}`
      : `${props?.siteInfo?.title} | loading`,
    description: post?.summary || '',
    type: post?.type || '',
    slug: post?.slug || '',
    image: post?.pageCoverThumbnail || siteInfo?.pageCover,
    category: post?.category?.[0],
    tags: post?.tags,
  };

  return (
    <>
      <CommonHead pageMeta={pageMeta} />
      <ThemeLayout />
    </>
  );
};

export const getStaticPaths: GetStaticPaths<PrefixParams> = async () => {
  if (!isProduct()) {
    return {
      paths: [],
      fallback: true,
    };
  }

  const { allPages } = await getSiteData('slug-index');
  return {
    paths: allPages.map((row) => ({ params: { slug: row.slug.split('/') } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<
  ArticleProps,
  PrefixParams
> = async ({ params, locale }) => {
  const { slug: slugList } = params as PrefixParams;
  const slug = slugList.join('/');
  const from = `slug-index-${slug}`;
  const props = await getSiteData(from);
  const { allPages, config } = props;

  // 在列表内查找文章
  let post = allPages.find((p) => {
    return p.slug === slug;
  });

  // handle the situation that navigate this page directly by use pageId
  // so no slug matched
  if (!post && isUUID(slug)) {
    post = await getIndependentPage(slug, from);
  }

  // 无法获取文章
  if (!post) {
    return {
      props: {
        ...props,
        post: null,
        ...(await serverSideTranslations(locale as string)),
      },
      revalidate: config.NEXT_REVALIDATE_SECOND,
    };
  }

  // 文章内容加载, 生成目录
  if (!post.blockMap) {
    post.blockMap = await getPostBlocks(post.id, from);
    post.toc = getPageTableOfContents(post, post.blockMap);
  }

  // for algolia search
  if (isProduct() && ALGOLIA_APPLICATION_ID) {
    uploadDataToAlgolia(post);
  }

  return {
    props: {
      ...props,
      post,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: config.NEXT_REVALIDATE_SECOND,
  };
};

export default Slug;
