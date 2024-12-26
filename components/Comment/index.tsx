import dynamic from 'next/dynamic';
import { isBrowser } from 'lib/utils';
import { useRouter } from 'next/router';
import { useSiteStore } from 'providers/siteProvider';
import { useConfigStore } from 'providers/configProvider';
import { useShallow } from 'zustand/react/shallow';

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
 * 评论组件
 * @param {*} param0
 * @returns
 */
const Comment = ({ className = '' }: { className?: string }) => {
  const router = useRouter();
  const post = useSiteStore((state) => state.post);
  const siteInfo = useSiteStore((state) => state.siteInfo);
  const {
    ARTALK_ENABLE,
    TWIKOO_ENABLE,
    GISCUS_ENABLE,
    GITALK_ENABLE,
    UTTERANCES_ENABLE,
    VALINE_ENABLE,
    WALINE_ENABLE,
    CUSDIS_ENABLE,
  } = useConfigStore(
    useShallow((state) => ({
      ARTALK_ENABLE: state.ARTALK_ENABLE,
      ARTALK_SERVER: state.ARTALK_SERVER,
      TWIKOO_ENABLE: state.TWIKOO_ENABLE,
      GISCUS_ENABLE: state.GISCUS_ENABLE,
      GITALK_ENABLE: state.GITALK_ENABLE,
      UTTERANCES_ENABLE: state.UTTERANCES_ENABLE,
      VALINE_ENABLE: state.VALINE_ENABLE,
      WALINE_ENABLE: state.WALINE_ENABLE,
      CUSDIS_ENABLE: state.CUSDIS_ENABLE,
    })),
  );

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
      {ARTALK_ENABLE && <Artalk siteInfo={siteInfo} />}
      {WALINE_ENABLE && <Waline />}
      {CUSDIS_ENABLE && <Cusdis post={post} />}
      {TWIKOO_ENABLE && <Twikoo />}
      {GITALK_ENABLE && <Gitalk post={post} />}
      {UTTERANCES_ENABLE && <Utterances />}
      {GISCUS_ENABLE && <Giscus />}
      {VALINE_ENABLE && <Valine post={post} />}
    </div>
  ) : null;
};

export default Comment;
