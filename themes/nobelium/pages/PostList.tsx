import React, { useState } from 'react';
import BLOG from 'blog.config';
import LayoutBase from '../layout/LayoutBase';
import { deepClone } from '@/lib/utils';
import BlogListPage from '../components/BlogListPage';
import BlogListScroll from '../components/BlogListScroll';
import BlogListBar from '../components/BlogListBar';
import { ContextWrapper } from '../providers';

import type {
  Page,
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
  const { posts, postCount, page, topSlot } = props;

  // 在列表中进行实时过滤
  const [filterKey, setFilterKey] = useState('');
  let filteredBlogPosts: Page[] = [];
  if (filterKey && posts) {
    filteredBlogPosts = posts.filter((post) => {
      const tagContent = post?.tags ? post?.tags.join(' ') : '';
      const searchContent = post.title + post.summary + tagContent;
      return searchContent.toLowerCase().includes(filterKey.toLowerCase());
    });
  } else {
    filteredBlogPosts = deepClone(posts);
  }
  return (
    <LayoutBase
      {...props}
      topSlot={<BlogListBar {...props} setFilterKey={setFilterKey} />}
    >
      {topSlot}
      {BLOG.POST_LIST_STYLE === 'page' ? (
        <BlogListPage
          postCount={postCount}
          page={page}
          posts={filteredBlogPosts}
        />
      ) : (
        <BlogListScroll posts={filteredBlogPosts} />
      )}
    </LayoutBase>
  );
};

export const OriginPostList = PostList;
export default ContextWrapper(PostList);
