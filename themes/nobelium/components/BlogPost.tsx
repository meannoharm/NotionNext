import Link from 'next/link';
import BLOG from '@/blog.config';
import dayjs from 'dayjs';

import type { FC } from 'react';
import type { PageInfo } from '@/lib/notion/types';

export interface BlogPostProps {
  post: PageInfo;
}
const BlogPost: FC<PageInfo> = ({ post }) => {
  console.log(post);
  return (
    <Link href={`${BLOG.SUB_PATH}/${post.slug}`}>
      <article key={post.id} className="mb-6 md:mb-8">
        <header className="flex flex-col justify-between md:flex-row md:items-baseline">
          <h2 className="mb-2 cursor-pointer text-lg font-medium text-black dark:text-gray-100 md:text-xl">
            {post.title}
          </h2>
          <time className="flex-shrink-0 text-gray-600 dark:text-gray-400">
            {dayjs(post?.publishDate).format('YYYY-MM-DD')}
          </time>
        </header>
        <main>
          <p className="hidden leading-8 text-gray-700 dark:text-gray-300 md:block">
            {post.summary}
          </p>
        </main>
      </article>
    </Link>
  );
};

export default BlogPost;
