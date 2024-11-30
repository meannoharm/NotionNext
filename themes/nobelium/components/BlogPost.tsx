import Link from 'next/link';
import BLOG from 'blog.config';
import dayjs from 'dayjs';

import type { FC } from 'react';
import type { Page } from '@/types';

export interface BlogPostProps {
  post: Page;
  isShowSummary?: boolean;
}
const BlogPost: FC<BlogPostProps> = ({ post, isShowSummary = true }) => {
  const isSearchResult = post.results && post.results.length > 0;

  return (
    <Link href={`${BLOG.SUB_PATH}/${post.slug}`}>
      <article
        key={post.id}
        className="mb-4 rounded px-3 py-2 hover:bg-gray-200/40 md:mb-6 dark:hover:bg-gray-800/40"
      >
        <header className="mb-2 flex flex-col justify-between md:flex-row md:items-baseline">
          <div className="mr-4 cursor-pointer text-lg font-medium text-gray-900 md:text-xl dark:text-gray-200">
            {post.title}
          </div>
          <time className="flex-shrink-0 text-gray-600 dark:text-gray-400">
            {dayjs(post?.date).format('YYYY-MM-DD')}
          </time>
        </header>
        {!isSearchResult && isShowSummary && post.summary && (
          <div className="hidden leading-8 text-gray-700 md:block dark:text-gray-300">
            {post.summary}
          </div>
        )}
        {post.results &&
          post.results.length > 0 && (
            <div
              key="result"
              className="hidden leading-8 text-gray-700 md:block dark:text-gray-300"
            >
              {post.results.map((result) => (
                <div>...{result}...</div>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
};

export default BlogPost;
