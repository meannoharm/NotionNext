import { useEffect, useState } from 'react';
import { deepClone } from '@/lib/utils';
import BLOG from '@/blog.config';
import LayoutBase from './LayoutBase';
import BlogListBar from '../components/BlogListBar';
import SearchNavBar from '../components/SearchNavBar';
import BlogListPage from '../components/BlogListPage';
import BlogListScroll from '../components/BlogListScroll';
import replaceSearchResult from '@/components/Mark';

import type { FC } from 'react';

export interface LayoutSearchProps {}

/**
 * 搜索
 * 页面是博客列表，上方嵌入一个搜索引导条
 * @param {*} props
 * @returns
 */
const LayoutSearch: FC<LayoutSearchProps> = (props) => {
  const { keyword, posts } = props;
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
    filteredBlogPosts = deepClone(posts);
  }
  console.log('posts', props, posts, filteredBlogPosts);

  return (
    <LayoutBase
      {...props}
      topSlot={<BlogListBar {...props} setFilterKey={setFilterKey} />}
    >
      <SearchNavBar {...props} />
      {BLOG.POST_LIST_STYLE === 'page' ? (
        <BlogListPage {...props} posts={filteredBlogPosts} />
      ) : (
        <BlogListScroll {...props} posts={filteredBlogPosts} />
      )}
    </LayoutBase>
  );
};

export default LayoutSearch;
