import { useState, useRef } from 'react';
import { algoliasearch, SearchClient } from 'algoliasearch';
import Link from 'next/link';
import throttle from 'lodash/throttle';
import markText from '@/lib/markText';
import { ALGOLIA_APPLICATION_ID, ALGOLIA_SEARCH_API_KEY, ALGOLIA_INDEX_NAME } from '@/constants';
import { useTranslation } from 'next-i18next';
import { useConfigStore } from '@/providers/configProvider';
import { useSiteStore } from '@/providers/siteProvider';

import type { AlgoliaRecord } from '@/lib/algolia';

/**
 * 结合 Algolia 实现的弹出式搜索框
 * 打开方式 cRef.current.openSearch()
 * https://www.algolia.com/doc/api-reference/search-api-parameters/
 */
export default function AlgoliaSearchModal() {
  const [searchResults, setSearchResults] = useState<AlgoliaRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [totalPage, setTotalPage] = useState(0);
  const [totalHit, setTotalHit] = useState(0);
  const [useTime, setUseTime] = useState(0);
  const SUB_PATH = useConfigStore((state) => state.SUB_PATH);
  const { t } = useTranslation('search');

  const algoliaRef = useRef<SearchClient | null>(null);
  if (!algoliaRef.current) {
    algoliaRef.current = algoliasearch(
      ALGOLIA_APPLICATION_ID || '',
      ALGOLIA_SEARCH_API_KEY || '',
    );
  }

  /**
   * 搜索
   * @param {*} query
   */
  const handleSearch = async (query: string, page: number) => {
    setKeyword(query);
    setPage(page);
    setSearchResults([]);
    setUseTime(0);
    setTotalPage(0);
    setTotalHit(0);
    if (!query || query === '') {
      return;
    }

    try {
      if (!algoliaRef.current) {
        return;
      }
      const res = await algoliaRef.current.searchSingleIndex<AlgoliaRecord>({indexName: ALGOLIA_INDEX_NAME, searchParams: {query, page}});
      const { hits, nbHits, nbPages, processingTimeMS } = res.results;
      setUseTime(processingTimeMS);
      setTotalPage(nbPages);
      setTotalHit(nbHits);
      setSearchResults(hits);

      setTimeout(() => {
        markText('search-wrapper',query, {
          element: 'span',
          className: 'text-blue-600 border-b border-dashed',
        },);
      }, 150);
    } catch (error) {
      console.error('Algolia search error:', error);
    }
  };

  const throttledHandleSearch = useRef(throttle(handleSearch, 300)); // 设置节流延迟时间

  // 修改input的onChange事件处理函数
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    throttledHandleSearch.current(query, 0);
  };

  /**
   * 切换页码
   * @param {*} page
   */
  const switchPage = (page: number) => {
    throttledHandleSearch.current(keyword, page);
  };

  /**
   * 关闭弹窗
   */
  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!ALGOLIA_APPLICATION_ID) {
    return null;
  }

  return (
    <div
      className={`${isModalOpen ? 'opacity-100' : 'pointer-events-none invisible opacity-0'} fixed left-0 top-0 z-30 mt-12 flex h-screen w-screen items-start justify-center`}
    >
      {/* 模态框 */}
      <div
        className={`${isModalOpen ? 'opacity-100' : 'invisible translate-y-10 opacity-0'} dark:bg- z-50 flex min-h-[10rem] w-full max-w-xl flex-col justify-between rounded-lg border bg-white p-5 shadow transition-all duration-300 hover:border-blue-600 dark:border-gray-800 dark:bg-hexo-black-gray `}
      >
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">{t('search')}</div>
          <div>
            <i
              className="fa-solid fa-xmark cursor-pointer p-1 text-gray-600 hover:text-blue-600"
              onClick={closeModal}
            ></i>
          </div>
        </div>

        <input
          type="text"
          placeholder={t('search_placeholder')}
          onChange={(e) => handleInputChange(e)}
          className="my-2 mb-4 w-full rounded-md border bg-gray-50 px-4 py-1 text-black outline-blue-500 dark:bg-gray-600 dark:text-gray-200"
        />

        {/* 标签组 */}
        <div className="mb-4">
          <TagGroups />
        </div>

        <ul id="search-wrapper">
          {searchResults.map((result) => (
            <li key={result.objectID} className="my-2">
              <a
                href={`${SUB_PATH}/${result.slug}`}
                className="font-bold text-black hover:text-blue-600 dark:text-gray-200"
              >
                {result.title}
              </a>
            </li>
          ))}
        </ul>

        <Pagination totalPage={totalPage} page={page} switchPage={switchPage} />
        <div>
          {totalHit > 0 && (
            <div>
              {t('search_result', { totalHit, useTime })}
            </div>
          )}
        </div>
        <div className="mt-2 text-gray-600">
          <span>
            <i className="fa-brands fa-algolia"></i> {t('search_algolia')}
          </span>{' '}
        </div>
      </div>

      {/* 遮罩 */}
      <div
        onClick={closeModal}
        className="glassmorphism fixed left-0 top-0 z-30 flex h-full w-full items-center justify-center"
      />
    </div>
  );
}

/**
 * 标签组
 */
function TagGroups() {
  const tagOptions = useSiteStore((state) => state.tagOptions);
  //  获取tagOptions数组前十个
  const firstTenTags = tagOptions?.slice(0, 10);

  return (
    <div id="tags-group" className="space-y-2 dark:border-gray-700">
      {firstTenTags?.map((tag, index) => {
        return (
          <Link
            passHref
            key={index}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className={'inline-block cursor-pointer whitespace-nowrap'}
          >
            <div
              className={
                ' flex items-center rounded-lg px-2 py-0.5 text-black transition-all duration-150 hover:scale-110 hover:bg-blue-600 hover:text-white dark:text-gray-300 dark:hover:bg-yellow-600'
              }
            >
              <div className="text-lg">{tag.name} </div>
              {tag.count ? (
                <sup className="relative ml-1">{tag.count}</sup>
              ) : (
                <></>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/**
 * 分页
 * @param {*} param0
 */
function Pagination(props: { totalPage: number; page: number; switchPage: (page: number) => void }) {
  const { totalPage, page, switchPage } = props;
  if (totalPage <= 0) {
    return null;
  }
  const pagesElement = [];

  for (let i = 0; i < totalPage; i++) {
    const selected = page === i;
    pagesElement.push(getPageElement(i, selected, switchPage));
  }
  return (
    <div className="flex w-full justify-center space-x-1 py-1">
      {pagesElement.map((p) => p)}
    </div>
  );
}

/**
 * 获取分页按钮
 * @param {*} i
 * @param {*} selected
 */
function getPageElement(i: number, selected: boolean, switchPage: (page: number) => void) {
  return (
    <div
      onClick={() => switchPage(i)}
      className={`${selected ? 'rounded bg-blue-600 font-bold text-white' : 'hover:font-bold hover:text-blue-600'} h-6 w-6  cursor-pointer text-center `}
    >
      {i + 1}
    </div>
  );
}
