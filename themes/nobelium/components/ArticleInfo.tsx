import Image from 'next/image';
import BLOG from 'blog.config';
import TagItem from './TagItem';
import md5 from 'js-md5';
import dayjs from 'dayjs';

import type { FC } from 'react';
import type { Page } from '@/types';
import Link from 'next/link';

export interface ArticleInfoProps {
  post: Page;
}

export const ArticleInfo: FC<ArticleInfoProps> = ({ post }) => {
  const emailHash = md5(BLOG.CONTACT_EMAIL);

  return (
    <section className="mt-2 flex flex-col font-light">
      <div className="text-3xl font-bold text-black dark:text-white">
        {post?.title}
      </div>

      {post?.type !== 'Page' && (
        <>
          <div className="mt-7 flex items-center text-gray-500 dark:text-gray-500">
            <Link href={BLOG.CONTACT_GITHUB || '#'} className="mr-4">
              <Image
                alt={BLOG.AUTHOR}
                width={24}
                height={24}
                src={`https://gravatar.com/avatar/${emailHash}`}
              />
            </Link>
            <div className="mr-2 md:block">{BLOG.AUTHOR}</div>
            <div className="mr-2 md:ml-0">
              {dayjs(post?.date).format('YYYY-MM-DD')}
            </div>
            <span className="busuanzi_container_page_pv mr-2 hidden">
              <i className="fas fa-eye mr-1" />
              <span className="busuanzi_value_page_pv mr-2" />
            </span>
          </div>
          <div className="mt-4">
            {post?.tags && (
              <div className="article-tags mr-2 flex max-w-full flex-nowrap overflow-x-auto">
                {post?.tags.map((tag) => <TagItem key={tag} tag={tag} />)}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default ArticleInfo;
