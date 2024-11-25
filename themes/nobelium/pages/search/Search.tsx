import { useEffect } from 'react';
import BLOG from 'blog.config';
import replaceSearchResult from '@/components/Mark';
import { isBrowser } from '@/utils';
import LayoutBase from '@themes/nobelium/layout/LayoutBase';
import BlogListPage from '@themes/nobelium/components/BlogListPage';
import BlogListScroll from '@themes/nobelium/components/BlogListScroll';
import { ContextWrapper } from '@themes/nobelium/providers/index';
import SearchInput from './components/SearchInput';

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

  return (
    <LayoutBase {...props}>
      <SearchInput keyword={keyword} />
      {BLOG.POST_LIST_STYLE === 'page' ? (
        <BlogListPage postCount={postCount} posts={posts} />
      ) : (
        <BlogListScroll posts={posts} />
      )}
    </LayoutBase>
  );
};

export default ContextWrapper(Search);
