import { useRouter } from 'next/router';
import { type FC, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';

export interface SearchInputProps {
  keyword: string;
}

const SearchInput: FC<SearchInputProps> = ({ keyword }) => {
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
    <section className="focus:border- flex w-full rounded bg-gray-100 px-4 py-2 dark:bg-gray-900">
      <input
        ref={searchInputRef}
        type="text"
        placeholder={t('search-articles')}
        className={
          'flex-1 bg-gray-100 p-2 text-gray-900 outline-none transition  dark:bg-gray-900 dark:text-gray-100'
        }
        onKeyUp={handleKeyUp}
        onCompositionStart={lockSearchInput}
        onCompositionUpdate={lockSearchInput}
        onCompositionEnd={unLockSearchInput}
        onChange={updateSearchKey}
        defaultValue={keyword || ''}
      />
      {showClean && (
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
