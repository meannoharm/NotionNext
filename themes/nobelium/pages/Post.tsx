import LayoutBase from '../layout/LayoutBase';
import ArticleLock from '../components/ArticleLock';
import ArticleInfo from '../components/ArticleInfo';
import ArticleFooter from '../components/ArticleFooter';
// TODO: move to theme file
import NotionPage from '@/components/NotionPage';
import ShareBar from '@/components/ShareBar';
import Comment from '@/components/Comment';
import { ContextWrapper } from '../providers';

import type { FC } from 'react';
import type { ThemeArticleProps } from '@/types';

const Post: FC<ThemeArticleProps> = (props) => {
  const { post, isLock, validPassword } = props;

  return (
    <LayoutBase {...props}>
      {isLock && <ArticleLock validPassword={validPassword} />}

      {!isLock && (
        <div id="article-wrapper" className="px-2">
          {post && <ArticleInfo post={post} />}
          {post && <NotionPage post={post} />}
          <ShareBar post={post} />
          <Comment frontMatter={post} />
          <ArticleFooter />
        </div>
      )}
    </LayoutBase>
  );
};

export default ContextWrapper(Post);
