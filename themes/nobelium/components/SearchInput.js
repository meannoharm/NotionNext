import { useRouter } from 'next/router';
import { useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';

let lock = false;

const SearchInput = (props) => {
  const { tag, keyword, cRef } = props;
  const router = useRouter();
  const searchInputRef = useRef(null);
  const { t } = useTranslation('common');
  useImperativeHandle(cRef, () => {
    return {
      focus: () => {
        searchInputRef?.current?.focus();
      },
    };
  });
  const handleSearch = () => {
    const key = searchInputRef.current.value;
    if (key && key !== '') {
      router.push({ pathname: '/search/' + key }).then((r) => {
        // console.log('搜索', key)
      });
    } else {
      router.push({ pathname: '/' }).then((r) => {});
    }
  };
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      // 回车
      handleSearch(searchInputRef.current.value);
    } else if (e.keyCode === 27) {
      // ESC
      cleanSearch();
    }
  };
  const cleanSearch = () => {
    searchInputRef.current.value = '';
    setShowClean(false);
  };
  function lockSearchInput() {
    lock = true;
  }

  function unLockSearchInput() {
    lock = false;
  }
  const [showClean, setShowClean] = useState(false);
  const updateSearchKey = (val) => {
    if (lock) {
      return;
    }
    searchInputRef.current.value = val;
    if (val) {
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
        onChange={(e) => updateSearchKey(e.target.value)}
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
