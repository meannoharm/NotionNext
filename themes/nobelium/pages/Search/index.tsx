import LayoutBase from '@themes/nobelium/layout/LayoutBase';
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
const Search: FC<ThemeSearchProps> = () => {
  // useEffect(() => {
  //   if (isBrowser) {
  //     replaceSearchResult({
  //       doms: document.getElementById('posts-wrapper'),
  //       search: keyword,
  //       target: {
  //         element: 'span',
  //         className: 'text-red-500 border-b border-dashed',
  //       },
  //     });
  //   }
  // }, []);

  return (
    <LayoutBase>
      <SearchInput />
    </LayoutBase>
  );
};

export default ContextWrapper(Search);
