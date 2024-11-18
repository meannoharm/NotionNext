import { getGlobalData } from '@/lib/notion/getNotionData';
import { useRouter } from 'next/router';
import BLOG from 'blog.config';
import { useLayout } from '@/lib/theme';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import type { FC } from 'react';
import type { PageMeta, SearchIndexProps, ThemeSearchProps } from '@/types';
import type { GetStaticProps } from 'next';

/**
 * 搜索路由
 * @param {*} props
 * @returns
 */
const SearchIndex: FC<SearchIndexProps> = (props) => {
  const { posts, siteInfo } = props;
  const { t } = useTranslation('nav');
  const router = useRouter();
  const keyword = router.query.s ? String(router.query.s) : '';

  // 根据页面路径加载不同Layout文件
  const Layout = useLayout() as FC<ThemeSearchProps>;

  const filteredPosts = keyword
    ? posts.filter((post) => {
        const tagContent = post?.tags ? post.tags.join(' ') : '';
        const searchContent =
          post.title + post.summary + tagContent + post.category;
        return searchContent.toLowerCase().includes(keyword.toLowerCase());
      })
    : [];

  const pageMeta: PageMeta = {
    title: `${keyword || ''}${keyword ? ' | ' : ''}${t('search')} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'search',
    type: 'website',
  };

  return (
    <Layout
      {...props}
      pageMeta={pageMeta}
      posts={filteredPosts}
      keyword={keyword}
    />
  );
};

/**
 * 浏览器前端搜索
 */
export const getStaticProps: GetStaticProps<SearchIndexProps> = async ({
  locale,
}) => {
  const { allPages, ...restProps } = await getGlobalData('search-props');
  const posts = allPages?.filter(
    (page) => page.type === 'Post' && page.status === 'Published',
  );
  return {
    props: {
      ...restProps,
      posts,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: BLOG.NEXT_REVALIDATE_SECOND,
  };
};

export default SearchIndex;
