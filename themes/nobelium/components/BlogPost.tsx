import Link from 'next/link';
import BLOG from 'blog.config';
import dayjs from 'dayjs';

import type { FC } from 'react';
import type { PageInfo } from '@/lib/notion/types';

export interface BlogPostProps {
  post: PageInfo;
  isShowSummary?: boolean;
}
const BlogPost: FC<BlogPostProps> = ({ post, isShowSummary = true }) => {
  return (
    <Link href={`${BLOG.SUB_PATH}/${post.slug}`}>
      <article
        key={post.id}
        className="mb-4 rounded px-3 py-2 hover:bg-gray-200 md:mb-6 dark:hover:bg-gray-800"
      >
        <header className="flex flex-col justify-between md:flex-row md:items-baseline">
          <div className="mr-4 cursor-pointer text-lg font-medium text-gray-900 md:text-xl dark:text-gray-200">
            {post.title}
          </div>
          <time className="flex-shrink-0 text-gray-600 dark:text-gray-400">
            {dayjs(post?.publishDate).format('YYYY-MM-DD')}
          </time>
        </header>
        {isShowSummary && post.summary && (
          <div className="mb-2 hidden leading-8 text-gray-700 md:block dark:text-gray-300">
            {post.summary}
          </div>
        )}
      </article>
    </Link>
  );
};

export default BlogPost;
