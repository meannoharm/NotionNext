import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSiteStore } from '@/providers/siteProvider';

const SearchInput = () => {
  const router = useRouter();
  const keyword = useSiteStore((state) => state.keyword);
  const { t } = useTranslation('common');

  const [text, setText] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText(keyword);
  }, [keyword]);
  const isShowClean = useMemo(() => !!text.trim(), [text]);

  const handleSearch = () => {
    if (text.trim()) {
      router.push(`/search/${text}`);
    } else {
      router.push('/');
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
    else if (e.key === 'Escape') cleanSearch();
  };

  const cleanSearch = () => {
    setText('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <section className="flex w-full rounded bg-gray-100 px-4 py-2  focus-within:ring-2 dark:bg-gray-900">
      <input
        ref={searchInputRef}
        type="text"
        placeholder={t('search-articles')}
        className={
          'flex-1 bg-gray-100 p-2 text-gray-900 outline-none transition  dark:bg-gray-900 dark:text-gray-100'
        }
        onKeyUp={handleKeyUp}
        onChange={handleChange}
        value={text}
      />
      {isShowClean && (
        <div
          className="transform cursor-pointer p-2 text-gray-500 duration-200 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={cleanSearch}
        >
          <i className="fas fa-times " />
        </div>
      )}
      <div
        className="transform cursor-pointer p-2 text-gray-500 duration-200 hover:text-gray-700 dark:hover:text-gray-300"
        onClick={handleSearch}
      >
        <i className={'fas fa-search'} />
      </div>
    </section>
  );
};

export default SearchInput;
