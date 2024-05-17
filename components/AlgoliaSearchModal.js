import { useState, useImperativeHandle, useRef } from 'react';
import BLOG from '@/blog.config';
import algoliasearch from 'algoliasearch';
import replaceSearchResult from '@/components/Mark';
import Link from 'next/link';
import { useGlobal } from '@/lib/global';
import throttle from 'lodash/throttle';

/**
 * 结合 Algolia 实现的弹出式搜索框
 * 打开方式 cRef.current.openSearch()
 * https://www.algolia.com/doc/api-reference/search-api-parameters/
 */
export default function AlgoliaSearchModal({ cRef }) {
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState(null);
  const [totalPage, setTotalPage] = useState(0);
  const [totalHit, setTotalHit] = useState(0);
  const [useTime, setUseTime] = useState(0);

  /**
   * 对外暴露方法
   */
  useImperativeHandle(cRef, () => {
    return {
      openSearch: () => {
        setIsModalOpen(true);
      },
    };
  });

  const client = algoliasearch(
    BLOG.ALGOLIA_APP_ID,
    BLOG.ALGOLIA_SEARCH_ONLY_APP_KEY,
  );
  const index = client.initIndex(BLOG.ALGOLIA_INDEX);

  /**
   * 搜索
   * @param {*} query
   */
  const handleSearch = async (query, page) => {
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
      const res = await index.search(query, { page, hitsPerPage: 10 });
      const { hits, nbHits, nbPages, processingTimeMS } = res;
      setUseTime(processingTimeMS);
      setTotalPage(nbPages);
      setTotalHit(nbHits);
      setSearchResults(hits);

      const doms = document
        .getElementById('search-wrapper')
        .getElementsByClassName('replace');

      setTimeout(() => {
        replaceSearchResult({
          doms,
          search: query,
          target: {
            element: 'span',
            className: 'text-blue-600 border-b border-dashed',
          },
        });
      }, 150);
    } catch (error) {
      console.error('Algolia search error:', error);
    }
  };

  const throttledHandleSearch = useRef(throttle(handleSearch, 300)); // 设置节流延迟时间

  // 修改input的onChange事件处理函数
  const handleInputChange = (e) => {
    const query = e.target.value;
    throttledHandleSearch.current(query, 0);
  };

  /**
   * 切换页码
   * @param {*} page
   */
  const switchPage = (page) => {
    throttledHandleSearch.current(keyword, page);
  };

  /**
   * 关闭弹窗
   */
  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!BLOG.ALGOLIA_APP_ID) {
    return <></>;
  }

  return (
    <div
      id="search-wrapper"
      className={`${isModalOpen ? 'opacity-100' : 'pointer-events-none invisible opacity-0'} fixed left-0 top-0 z-30 mt-12 flex h-screen w-screen items-start justify-center`}
    >
      {/* 模态框 */}
      <div
        className={`${isModalOpen ? 'opacity-100' : 'invisible translate-y-10 opacity-0'} dark:bg- z-50 flex min-h-[10rem] w-full max-w-xl flex-col justify-between rounded-lg border bg-white p-5 shadow transition-all duration-300 hover:border-blue-600 dark:border-gray-800 dark:bg-hexo-black-gray `}
      >
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">搜索</div>
          <div>
            <i
              className="fa-solid fa-xmark cursor-pointer p-1 text-gray-600 hover:text-blue-600"
              onClick={closeModal}
            ></i>
          </div>
        </div>

        <input
          type="text"
          placeholder="在这里输入搜索关键词..."
          onChange={(e) => handleInputChange(e)}
          className="my-2 mb-4 w-full rounded-md border bg-gray-50 px-4 py-1 text-black outline-blue-500 dark:bg-gray-600 dark:text-gray-200"
        />

        {/* 标签组 */}
        <div className="mb-4">
          <TagGroups />
        </div>

        <ul>
          {searchResults.map((result) => (
            <li key={result.objectID} className="replace my-2">
              <a
                href={`${BLOG.SUB_PATH}/${result.slug}`}
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
              共搜索到 {totalHit} 条结果，用时 {useTime} 毫秒
            </div>
          )}
        </div>
        <div className="mt-2 text-gray-600">
          <span>
            <i className="fa-brands fa-algolia"></i> Algolia 提供搜索服务
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
  const { tagOptions } = useGlobal();
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
function Pagination(props) {
  const { totalPage, page, switchPage } = props;
  if (totalPage <= 0) {
    return <></>;
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
function getPageElement(i, selected, switchPage) {
  return (
    <div
      onClick={() => switchPage(i)}
      className={`${selected ? 'rounded bg-blue-600 font-bold text-white' : 'hover:font-bold hover:text-blue-600'} h-6 w-6  cursor-pointer text-center `}
    >
      {i + 1}
    </div>
  );
}
