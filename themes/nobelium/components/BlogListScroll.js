import { useEffect } from 'react';
import BLOG from '@/blog.config';
import Link from 'next/link';
import React from 'react';
import throttle from 'lodash.throttle';
import { deepClone } from '@/lib/utils';
import { useTranslation } from 'next-i18next';

export const BlogListScroll = (props) => {
  const { posts } = props;
  const { t } = useTranslation('common');

  const [page, updatePage] = React.useState(1);

  let hasMore = false;
  const postsToShow =
    posts && Array.isArray(posts)
      ? deepClone(posts).slice(0, BLOG.POSTS_PER_PAGE * page)
      : [];

  if (posts) {
    const totalCount = posts.length;
    hasMore = page * BLOG.POSTS_PER_PAGE < totalCount;
  }
  const handleGetMore = () => {
    if (!hasMore) return;
    updatePage(page + 1);
  };

  const targetRef = React.useRef(null);

  // 监听滚动自动分页加载
  useEffect(() => {
    const scrollTrigger = throttle(() => {
      const scrollS = window.scrollY + window.outerHeight;
      const clientHeight = targetRef
        ? targetRef.current
          ? targetRef.current.clientHeight
          : 0
        : 0;
      if (scrollS > clientHeight + 100) {
        handleGetMore();
      }
    }, 500);

    window.addEventListener('scroll', scrollTrigger);
    return () => {
      window.removeEventListener('scroll', scrollTrigger);
    };
  }, []);

  return (
    <div id="posts-wrapper" className="mb-12 w-full md:pr-12" ref={targetRef}>
      {postsToShow.map((p) => (
        <article key={p.id} className="mb-12">
          <h2 className="mb-4">
            <Link
              href={`/${p.slug}`}
              className="text-xl text-black no-underline hover:underline md:text-2xl"
            >
              {p.title}
            </Link>
          </h2>

          <div className="mb-4 text-sm text-gray-700">
            by{' '}
            <a href="#" className="text-gray-700">
              {BLOG.AUTHOR}
            </a>{' '}
            on {p.date?.start_date || p.createdTime}
            <span className="mx-1 font-bold"> | </span>
            <a href="#" className="text-gray-700">
              {p.category}
            </a>
            <span className="mx-1 font-bold"> | </span>
            {/* <a href="#" className="text-gray-700">2 Comments</a> */}
          </div>

          <p className="leading-normal text-gray-700">{p.summary}</p>
        </article>
      ))}

      <div
        onClick={handleGetMore}
        className="my-4 w-full cursor-pointer py-4 text-center "
      >
        {' '}
        {hasMore ? t('more') : `${t('no-more')} 😰`}{' '}
      </div>
    </div>
  );
};
