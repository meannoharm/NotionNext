import { useEffect, useState } from 'react';
import { deepClone } from '@/lib/utils';
import BLOG from '@/blog.config';
import replaceSearchResult from '@/components/Mark';
import { isBrowser } from '@/lib/utils';
import LayoutBase from '../layout/LayoutBase';
import BlogListBar from '../components/BlogListBar';
import SearchNavBar from '../components/SearchNavBar';
import BlogListPage from '../components/BlogListPage';
import BlogListScroll from '../components/BlogListScroll';
import { ContextWrapper } from '../providers/index';

import type { FC } from 'react';
import type { ThemeSearchProps } from '@/pages/types';

/**
 * 搜索
 * 页面是博客列表，上方嵌入一个搜索引导条
 * @param {*} props
 * @returns
 */
const Search: FC<ThemeSearchProps> = (props) => {
  const { keyword, posts, postCount, page } = props;
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

export default ContextWrapper(Search);
