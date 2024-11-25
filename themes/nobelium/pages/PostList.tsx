import React from 'react';
import BLOG from 'blog.config';
import LayoutBase from '../layout/LayoutBase';
import BlogListPage from '../components/BlogListPage';
import BlogListScroll from '../components/BlogListScroll';
import { ContextWrapper } from '../providers';

import type {
  ThemeHomeProps,
  ThemeCategoryDetailProps,
  ThemeCategoryPageProps,
  ThemeTagDetailProps,
  ThemeTagPageProps,
  ThemeSearchDetailProps,
  ThemeSearchPageProps,
} from '@/types';
import type { FC, ReactNode } from 'react';

/**
 * 博客列表
 * @param {*} props
 * @returns
 */
const PostList: FC<
  ThemeHomeProps &
    Partial<
      ThemeCategoryDetailProps &
        ThemeCategoryPageProps &
        ThemeTagDetailProps &
        ThemeTagPageProps &
        ThemeSearchDetailProps &
        ThemeSearchPageProps & {
          topSlot: ReactNode;
        }
    >
> = (props) => {
  const { posts, postCount, page } = props;

  return (
    <LayoutBase {...props}>
      {BLOG.POST_LIST_STYLE === 'page' ? (
        <BlogListPage postCount={postCount} page={page} posts={posts} />
      ) : (
        <BlogListScroll posts={posts} />
      )}
    </LayoutBase>
  );
};

export const OriginPostList = PostList;
export default ContextWrapper(PostList);
