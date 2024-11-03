import { useState } from 'react';
import BLOG from '@/blog.config';
import LayoutBase from '../layout/LayoutBase';
import { deepClone } from '@/lib/utils';
import BlogListPage from '../components/BlogListPage';
import BlogListScroll from '../components/BlogListScroll';
import BlogListBar from '../components/BlogListBar';

import type { PostListComponents } from '@/themes/types';
import type { PageInfo } from '@/notion/types';

/**
 * 博客列表
 * @param {*} props
 * @returns
 */
const PostList: PostListComponents = (props) => {
  const { posts, topSlot } = props;

  // 在列表中进行实时过滤
  const [filterKey, setFilterKey] = useState('');
  let filteredBlogPosts: PageInfo[] = [];
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
        <BlogListPage {...props} posts={filteredBlogPosts} />
      ) : (
        <BlogListScroll {...props} posts={filteredBlogPosts} />
      )}
    </LayoutBase>
  );
};

export default PostList;
