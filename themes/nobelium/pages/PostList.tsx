import React from 'react';
import BLOG from 'blog.config';
import LayoutBase from '../layout/LayoutBase';
import BlogListPage from '../components/BlogListPage';
import BlogListScroll from '../components/BlogListScroll';
import { ContextWrapper } from '../providers';
import { useShallow } from 'zustand/react/shallow';
import { useSiteStore } from '@/providers/siteProvider';

import type { FC, ReactNode } from 'react';

export interface PostListProps {
  topSlot?: ReactNode;
}

/**
 * 博客列表
 * @param {*} props
 * @returns
 */
const PostList: FC<PostListProps> = (props) => {
  const { posts, page, postCount } = useSiteStore(
    useShallow((state) => ({
      posts: state.posts,
      page: state.page,
      postCount: state.postCount,
    })),
  );

  return (
    <LayoutBase topSlot={props.topSlot}>
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
