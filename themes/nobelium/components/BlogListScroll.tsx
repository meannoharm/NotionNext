import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import React from 'react';
import { throttle } from 'lodash';
import { useTranslation } from 'next-i18next';
import dayjs from 'dayjs';
import { useSiteStore } from '@/providers/siteProvider';
import { useConfigStore } from '@/providers/configProvider';
import { useShallow } from 'zustand/react/shallow';


const BlogListScroll = () => {
  const posts = useSiteStore((state) => state.posts);
  const { POSTS_PER_PAGE, AUTHOR } = useConfigStore(
    useShallow((state) => ({
      POSTS_PER_PAGE: state.POSTS_PER_PAGE,
      AUTHOR: state.AUTHOR,
    })),
  );
  const { t } = useTranslation('common');
  const [page, setPage] = useState(1);
  const targetRef = useRef<HTMLDivElement>(null);

  const hasMore = useMemo(
    () => page * POSTS_PER_PAGE < posts.length,
    [posts, page],
  );

  const postsToShow = useMemo(
    () => posts.slice(0, POSTS_PER_PAGE * page),
    [posts, page],
  );

  const handleGetMore = useCallback(() => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore]);

  // 监听滚动自动分页加载
  const scrollTrigger = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const clientHeight = targetRef.current?.clientHeight || 0;
    if (scrollPosition > clientHeight + 100) {
      handleGetMore();
    }
  }, [handleGetMore]);

  useEffect(() => {
    const scrollTriggerThrottled = throttle(scrollTrigger, 500);
    window.addEventListener('scroll', scrollTriggerThrottled);
    return () => {
      window.removeEventListener('scroll', scrollTriggerThrottled);
    };
  }, [scrollTrigger]);

  return (
    <div id="posts-wrapper" className="mb-12 w-full md:pr-12" ref={targetRef}>
      {postsToShow.map((post) => (
        <article key={post.id} className="mb-12">
          <h2 className="mb-4">
            <Link
              href={`/${post.slug}`}
              className="text-xl text-black no-underline hover:underline md:text-2xl"
            >
              {post.title}
            </Link>
          </h2>

          <div className="mb-4 text-sm text-gray-700">
            by
            <a href="#" className="text-gray-700">
              {AUTHOR}
            </a>
            on {dayjs(post.date).format('YYYY-MM-DD')}
            <span className="mx-1 font-bold"> | </span>
            <a href="#" className="text-gray-700">
              {post.category}
            </a>
            <span className="mx-1 font-bold"> | </span>
            {/* <a href="#" className="text-gray-700">2 Comments</a> */}
          </div>

          <p className="leading-normal text-gray-700">{post.summary}</p>
        </article>
      ))}

      <div
        onClick={handleGetMore}
        className="my-4 w-full cursor-pointer py-4 text-center "
      >
        {hasMore ? t('more') : `${t('no-more')} 😰`}{' '}
      </div>
    </div>
  );
};

export default BlogListScroll;
