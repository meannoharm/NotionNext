import { useRouter } from 'next/router';
import { type FC, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';

export interface SearchInputProps {
  tag: string;
  keyword: string;
}

const SearchInput: FC<SearchInputProps> = ({ tag, keyword }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [showClean, setShowClean] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const lock = useRef(false);

  const handleSearch = () => {
    const key = searchInputRef.current?.value.trim();
    if (key) {
      router.push(`/search/${key}`);
    } else {
      router.push('/');
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
    else if (e.key === 'Escape') cleanSearch();
  };

  const cleanSearch = () => {
    (searchInputRef.current as HTMLInputElement).value = '';
    setShowClean(false);
  };

  function lockSearchInput() {
    lock.current = true;
  }

  function unLockSearchInput() {
    lock.current = false;
  }
  const updateSearchKey = () => {
    if (lock.current) {
      return;
    }
    if (searchInputRef.current?.value) {
      setShowClean(true);
    } else {
      setShowClean(false);
    }
  };

  return (
    <section className="flex w-full bg-gray-100">
      <input
        ref={searchInputRef}
        type="text"
        placeholder={tag ? `${t('tags')} #${tag}` : `${t('search-articles')}`}
        className={
          'w-full bg-gray-100 pl-4 text-sm font-light leading-10 text-black outline-none transition focus:shadow-lg dark:bg-gray-900 dark:text-white'
        }
        onKeyUp={handleKeyUp}
        onCompositionStart={lockSearchInput}
        onCompositionUpdate={lockSearchInput}
        onCompositionEnd={unLockSearchInput}
        onChange={updateSearchKey}
        defaultValue={keyword || ''}
      />

      <div
        className="float-right -ml-8 cursor-pointer items-center justify-center py-2"
        onClick={handleSearch}
      >
        <i
          className={
            'fas fa-search transform  cursor-pointer text-gray-500 duration-200 hover:text-black'
          }
        />
      </div>

      {showClean && (
        <div className="float-right -ml-12 cursor-pointer items-center justify-center py-2 dark:bg-gray-600 dark:hover:bg-gray-800">
          <i
            className="fas fa-times transform cursor-pointer text-gray-400 duration-200 hover:text-black"
            onClick={cleanSearch}
          />
        </div>
      )}
    </section>
  );
};

export default SearchInput;
