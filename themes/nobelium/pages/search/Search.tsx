import { useEffect, useState } from 'react';
import BLOG from 'blog.config';
import replaceSearchResult from '@/components/Mark';
import { isBrowser } from '@/utils';
import LayoutBase from '@themes/nobelium/layout/LayoutBase';
import BlogListBar from '@themes/nobelium/components/BlogListBar';
import SearchNavBar from './components/SearchNavBar';
import BlogListPage from '@themes/nobelium/components/BlogListPage';
import BlogListScroll from '@themes/nobelium/components/BlogListScroll';
import { ContextWrapper } from '@themes/nobelium/providers/index';
import { cloneDeep } from 'lodash';

import type { FC } from 'react';
import type { ThemeSearchProps } from '@/types';

/**
 * 搜索
 * 页面是博客列表，上方嵌入一个搜索引导条
 * @param {*} props
 * @returns
 */
const Search: FC<ThemeSearchProps> = (props) => {
  const { keyword, posts, postCount } = props;
  useEffect(() => {
    if (isBrowser) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: {
          element: 'span',
          className: 'text-red-500 border-b border-dashed',
        },
      });
    }
  }, []);

  // 在列表中进行实时过滤
  const [filterKey, setFilterKey] = useState('');
  let filteredBlogPosts = [];
  if (filterKey && posts) {
    filteredBlogPosts = posts.filter((post) => {
      const tagContent = post?.tags ? post?.tags.join(' ') : '';
      const searchContent = post.title + post.summary + tagContent;
      return searchContent.toLowerCase().includes(filterKey.toLowerCase());
    });
  } else {
    filteredBlogPosts = cloneDeep(posts);
  }

  return (
    <LayoutBase
      {...props}
      topSlot={<BlogListBar {...props} setFilterKey={setFilterKey} />}
    >
      <SearchNavBar {...props} />
      {BLOG.POST_LIST_STYLE === 'page' ? (
        <BlogListPage postCount={postCount} posts={filteredBlogPosts} />
      ) : (
        <BlogListScroll posts={filteredBlogPosts} />
      )}
    </LayoutBase>
  );
};

export default ContextWrapper(Search);
