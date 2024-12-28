import { useSiteStore } from 'providers/siteProvider';
import BlogList from '../components/BlogList';
import SearchInput from '../components/SearchInput';
import LayoutBase from '../layout/LayoutBase';
import markText from '@/utils/markText';
import { useEffect } from 'react';

const SearchDetail = () => {
  const keyword = useSiteStore((state) => state.keyword);

  useEffect(() => {
    markText('#posts-wrapper', keyword, {
      element: 'span',
      className: 'text-red-500 border-b border-dashed',
    });
  }, [keyword]);

  return (
    <LayoutBase>
      <SearchInput />
      <div className="mt-6 text-3xl font-bold text-black dark:text-white">
        {keyword}
      </div>
      <BlogList />
    </LayoutBase>
  );
};

export default SearchDetail;
