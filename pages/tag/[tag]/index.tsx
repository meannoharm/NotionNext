import { getGlobalData } from '@/lib/notion/getNotionData';
import BLOG from '@/blog.config';
import { useRouter } from 'next/router';
import { getLayoutByTheme } from '@/theme';
import { useTranslation } from 'next-i18next';

import type { FC } from 'react';
import type {
  PageMeta,
  TagDetailProps,
  ThemeTagDetailProps,
} from '@/pages/types';
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

  // 根据页面路径加载不同Layout文件
  const Layout = getLayoutByTheme(useRouter()) as FC<ThemeTagDetailProps>;

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
  TagDetailProps,
  TagIndexParams
> = async (context) => {
  const { tag } = context.params as TagIndexParams;
  const { allPages, ...globalProps } = await getGlobalData('tag-props');

  const filteredPosts = allPages
    ?.filter((page) => page.type === 'Post' && page.status === 'Published')
    .filter((post) => post && post?.tags && post?.tags.includes(tag));

  const posts =
    BLOG.POST_LIST_STYLE === 'page'
      ? filteredPosts.slice(0, BLOG.POSTS_PER_PAGE)
      : filteredPosts;

  return {
    props: {
      ...globalProps,
      postCount: posts.length,
      tag,
      posts,
    },
    revalidate: BLOG.NEXT_REVALIDATE_SECOND,
  };
};

export const getStaticPaths: GetStaticPaths<TagIndexParams> = async () => {
  const { tagOptions } = await getGlobalData('tag-static-path');

  return {
    paths: tagOptions.map((tag) => ({ params: { tag: tag.name } })),
    fallback: true,
  };
};

export default TagIndex;
