import { useRouter } from 'next/router';
import Link from 'next/link';
import BlogPost from './BlogPost';
import { useTranslation } from 'next-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useSiteStore } from 'providers/siteProvider';
import { useConfigStore } from 'providers/configProvider';
import { getPagePrefix } from '@/utils';

const BlogListPage = () => {
  const { posts, page, postCount } = useSiteStore(
    useShallow((state) => ({
      posts: state.posts,
      page: state.page,
      postCount: state.postCount,
    })),
  );
  const POSTS_PER_PAGE = useConfigStore((state) => state.POSTS_PER_PAGE);
  const { t } = useTranslation('common');
  const router = useRouter();

  const totalPage = Math.ceil(postCount / POSTS_PER_PAGE);
  const showPrev = page > 1;
  const showNext = page < totalPage && posts?.length > 0;
  const pagePrefix = getPagePrefix(router.asPath);

  return (
    <div className="my-6 w-full">
      <div id="posts-wrapper">
        {posts?.map((post) => <BlogPost key={post.id} post={post} />)}
      </div>

      <div className="flex justify-between text-xs">
        <Link
          href={{
            pathname: `${pagePrefix}/page/${page - 1}`,
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
            pathname: `${pagePrefix}/page/${page + 1}`,
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
