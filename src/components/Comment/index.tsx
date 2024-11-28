import BLOG from 'blog.config';
import dynamic from 'next/dynamic';
import { isBrowser } from '@/lib/utils';
import { useRouter } from 'next/router';
import { useSiteStore } from '@/providers/siteProvider';

const Artalk = dynamic(() => import('./Artalk'), { ssr: false });
const Waline = dynamic(() => import('./Waline'), { ssr: false });
const Cusdis = dynamic(() => import('./Cusdis'), { ssr: false });
const Twikoo = dynamic(() => import('./Twikoo'), { ssr: false });
const Gitalk = dynamic(() => import('./Gitalk'), { ssr: false });
const Utterances = dynamic(() => import('./Utterances'), {
  ssr: false,
});
const Giscus = dynamic(() => import('./Giscus'), { ssr: false });
const Valine = dynamic(() => import('./Valine'), {
  ssr: false,
});

/**
 * 是否有评论
 */
export const commentEnable =
  BLOG.COMMENT_TWIKOO_ENV_ID ||
  BLOG.COMMENT_WALINE_SERVER_URL ||
  BLOG.COMMENT_VALINE_APP_ID ||
  BLOG.COMMENT_GISCUS_REPO ||
  BLOG.COMMENT_CUSDIS_APP_ID ||
  BLOG.COMMENT_UTTERRANCES_REPO ||
  BLOG.COMMENT_GITALK_CLIENT_ID;

/**
 * 评论组件
 * @param {*} param0
 * @returns
 */
const Comment = ({ className = '' }: { className?: string }) => {
  const router = useRouter();
  const post = useSiteStore((state) => state.post);
  const siteInfo = useSiteStore((state) => state.siteInfo);

  if (
    isBrowser &&
    ('giscus' in router.query || router.query.target === 'comment')
  ) {
    setTimeout(() => {
      const url = router.asPath.replace('?target=comment', '');
      history.replaceState({}, '', url);
      document
        ?.getElementById('comment')
        ?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, 1000);
  }

  return post ? (
    <div
      id="comment"
      className={`comment mt-5 text-gray-800 dark:text-gray-200 ${className}`}
    >
      {BLOG.COMMENT_ARTALK_SERVER && <Artalk siteInfo={siteInfo} />}
      {BLOG.COMMENT_WALINE_SERVER_URL && <Waline />}
      {BLOG.COMMENT_CUSDIS_APP_ID && <Cusdis post={post} />}
      {BLOG.COMMENT_TWIKOO_ENV_ID && <Twikoo />}
      {BLOG.COMMENT_GITALK_CLIENT_ID && <Gitalk post={post} />}
      {BLOG.COMMENT_UTTERRANCES_REPO && <Utterances />}
      {BLOG.COMMENT_GISCUS_REPO && <Giscus />}

      {BLOG.COMMENT_VALINE_APP_ID && <Valine post={post} />}
    </div>
  ) : null;
};

export default Comment;
