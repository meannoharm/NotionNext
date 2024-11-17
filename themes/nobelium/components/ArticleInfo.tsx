import Image from 'next/image';
import BLOG from 'blog.config';
import TagItem from './TagItem';
import md5 from 'js-md5';
import dayjs from 'dayjs';

import type { FC } from 'react';
import type { PageInfo } from '@/lib/notion';

export interface ArticleInfoProps {
  post: PageInfo;
}

export const ArticleInfo: FC<ArticleInfoProps> = ({ post }) => {
  const emailHash = md5(BLOG.CONTACT_EMAIL);

  return (
    <section className="text-gray--600 mt-2 flex flex-wrap font-light leading-8 dark:text-gray-400">
      <div>
        <div className="text-3xl font-bold text-black dark:text-white">
          {post?.title}
        </div>

        {post?.type !== 'Page' && (
          <nav className="mt-7 flex items-start text-gray-500 dark:text-gray-400">
            <div className="mb-4 flex">
              <a href={BLOG.CONTACT_GITHUB || '#'} className="flex">
                <Image
                  alt={BLOG.AUTHOR}
                  width={24}
                  height={24}
                  src={`https://gravatar.com/avatar/${emailHash}`}
                  className="rounded-full"
                />
                <p className="ml-2 md:block">{BLOG.AUTHOR}</p>
              </a>
              <span className="mx-1 block">/</span>
            </div>
            <div className="mb-4 mr-2 md:ml-0">
              {dayjs(post?.publishDate).format('YYYY-MM-DD')}
            </div>
            {post?.tags && (
              <div className="article-tags mr-2 flex max-w-full flex-nowrap overflow-x-auto">
                {post?.tags.map((tag) => <TagItem key={tag} tag={tag} />)}
              </div>
            )}
            <span className="busuanzi_container_page_pv mr-2 hidden">
              <i className="fas fa-eye mr-1" />
              <span className="busuanzi_value_page_pv mr-2" />
            </span>
          </nav>
        )}
      </div>
    </section>
  );
};

export default ArticleInfo;
