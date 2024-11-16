import Link from 'next/link';
import BLOG from 'blog.config';
import dayjs from 'dayjs';

import type { FC } from 'react';
import type { PageInfo } from '@/lib/notion/types';

export interface BlogPostProps {
  post: PageInfo;
}
const BlogPost: FC<BlogPostProps> = ({ post }) => {
  return (
    <Link href={`${BLOG.SUB_PATH}/${post.slug}`}>
      <article key={post.id} className="mb-6 md:mb-8">
        <header className="mb-2 flex flex-col justify-between md:flex-row md:items-baseline">
          <div className="mr-4 cursor-pointer text-lg font-medium text-black md:text-xl dark:text-gray-100">
            {post.title}
          </div>
          <time className="flex-shrink-0 text-gray-600 dark:text-gray-400">
            {dayjs(post?.publishDate).format('YYYY-MM-DD')}
          </time>
        </header>
        <main>
          <p className="hidden leading-8 text-gray-700 md:block dark:text-gray-300">
            {post.summary}
          </p>
        </main>
      </article>
    </Link>
  );
};

export default BlogPost;
