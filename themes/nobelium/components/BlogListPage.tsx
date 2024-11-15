import BLOG from 'blog.config';
import { useRouter } from 'next/router';
import Link from 'next/link';
import BlogPost from './BlogPost';
import { useTranslation } from 'next-i18next';

import type { FC } from 'react';
import { PageInfo } from '@/lib/notion/types';

export interface BlogListPageProps {
  posts: PageInfo[];
  page?: number;
  postCount: number;
}

const BlogListPage: FC<BlogListPageProps> = (props) => {
  const { t } = useTranslation('common');
  const { page = 1, posts, postCount } = props;
  const router = useRouter();
  const totalPage = Math.ceil(postCount / BLOG.POSTS_PER_PAGE);
  const currentPage = +page;

  const showPrev = currentPage > 1;
  const showNext = currentPage < totalPage && posts?.length > 0;
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '');

  return (
    <div className="my-6 w-full">
      <div id="posts-wrapper">
        {posts?.map((post) => <BlogPost key={post.id} post={post} />)}
      </div>

      <div className="flex justify-between text-xs">
        <Link
          href={{
            pathname:
              currentPage - 1 === 1
                ? `${pagePrefix}/`
                : `${pagePrefix}/page/${currentPage - 1}`,
            query: router.query.s ? { s: router.query.s } : {},
          }}
          className={`${showPrev ? '  ' : ' pointer-events-none invisible block '}no-underline rounded px-3 py-2`}
        >
          <button rel="prev" className="block cursor-pointer">
            {t('prev')}
          </button>
        </Link>
        <Link
          href={{
            pathname: `${pagePrefix}/page/${currentPage + 1}`,
            query: router.query.s ? { s: router.query.s } : {},
          }}
          className={`${showNext ? '  ' : 'pointer-events-none invisible '}  rounded px-3 py-2 no-underline`}
        >
          <button rel="next" className="block cursor-pointer">
            {t('next')}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BlogListPage;
