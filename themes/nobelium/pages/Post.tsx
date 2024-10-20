import LayoutBase from '../layout/LayoutBase';
import ArticleLock from '../components/ArticleLock';
import ArticleInfo from '../components/ArticleInfo';
import ArticleFooter from '../components/ArticleFooter';
// TODO: move to theme file
import NotionPage from '@/components/NotionPage';
import ShareBar from '@/components/ShareBar';
import Comment from '@/components/Comment';

import type { FC } from 'react';

export interface LayoutSlugProps {
  post: any;
  lock: any;
  validPassword: any;
}

const Post: FC<LayoutSlugProps> = (props) => {
  const { post, lock, validPassword } = props;

  return (
    <LayoutBase {...props}>
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && (
        <div id="article-wrapper" className="px-2">
          <ArticleInfo post={post} />
          <NotionPage post={post} />
          <ShareBar post={post} />
          <Comment frontMatter={post} />
          <ArticleFooter />
        </div>
      )}
    </LayoutBase>
  );
};

export default Post;
