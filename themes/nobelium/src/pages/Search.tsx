import LayoutBase from '@themes/nobelium/src/layout/LayoutBase';
import SearchInput from '../components/SearchInput';

/**
 * 搜索
 * 页面是博客列表，上方嵌入一个搜索引导条
 * @param {*} props
 * @returns
 */
const Search = () => {
  return (
    <LayoutBase>
      <SearchInput />
    </LayoutBase>
  );
};

export default Search;
