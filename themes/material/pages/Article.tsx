import { useSiteStore } from '@/providers/siteProvider';
import Layout from '../layout/Layout';
import NotionPage from '@/components/NotionPage';
import ShareBar from '@/components/ShareBar';
import Comment from '@/components/Comment';
import { useShallow } from 'zustand/react/shallow';

const Article = () => {
  const { post, isLock } = useSiteStore(
    useShallow((state) => ({
      post: state.post,
      isLock: state.isLock,
    })),
  );

  return (
    <Layout>
      {/* {isLock && <ArticleLock />} */}

      {!isLock && post && (
        <div id="article-wrapper" className="px-2">
          <NotionPage post={post} />
          <ShareBar post={post} />
          <Comment />
        </div>
      )}
    </Layout>
  );
};

export default Article;
