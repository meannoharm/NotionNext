import { getGlobalData } from '@/lib/notion/getNotionData';
import BLOG from '@/blog.config';
import { useLayout } from '@/theme';
import { useTranslation } from 'next-i18next';

import type { FC } from 'react';
import type { PageMeta, TagPageProps, ThemeTagPageProps } from '@/pages/types';
import type { ParsedUrlQuery } from 'querystring';
import type { GetStaticProps, GetStaticPaths } from 'next';

export interface TagPageParams extends ParsedUrlQuery {
  tag: string;
  page: string;
}

const TagPage: FC<TagPageProps> = (props) => {
  const { tag, siteInfo } = props;
  const { t } = useTranslation('common');

  // 根据页面路径加载不同Layout文件
  const Layout = useLayout() as FC<ThemeTagPageProps>;

  const pageMeta: PageMeta = {
    title: `${tag} | ${t('tags')} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'tag/' + tag,
    type: 'website',
  };

  return <Layout pageMeta={pageMeta} {...props} />;
};

export const getStaticProps: GetStaticProps<
  TagPageProps,
  TagPageParams
> = async (context) => {
  const { tag, page } = context.params as TagPageParams;
  const props = await getGlobalData('tag-page-props');

  const pageNumber = parseInt(page, 10);

  const posts = props.allPages
    ?.filter((page) => page.type === 'Post' && page.status === 'Published')
    .filter((post) => post?.tags?.includes(tag));

  const paginatedPosts = posts.slice(
    BLOG.POSTS_PER_PAGE * (pageNumber - 1),
    BLOG.POSTS_PER_PAGE * pageNumber,
  );

  return {
    props: {
      ...props,
      posts: paginatedPosts,
      postCount: posts.length,
      tag,
      page: pageNumber,
    },
    revalidate: BLOG.NEXT_REVALIDATE_SECOND,
  };
};

export const getStaticPaths: GetStaticPaths<TagPageParams> = async () => {
  const { tagOptions, allPages } = await getGlobalData('tag-page-static-path');
  const paths: {
    params: TagPageParams;
  }[] = [];
  tagOptions?.forEach((tag) => {
    const tagPosts = allPages
      .filter((page) => page.type === 'Post' && page.status === 'Published')
      .filter((post) => post?.tags?.includes(tag.name)); // 过滤包含标签的文章

    const totalPages = Math.ceil(tagPosts.length / BLOG.POSTS_PER_PAGE);

    // 生成每一页的路径
    for (let i = 1; i <= totalPages; i++) {
      paths.push({ params: { tag: tag.name, page: String(i) } });
    }
  });
  return {
    paths: paths,
    fallback: true,
  };
};

export default TagPage;
