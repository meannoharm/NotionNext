import { useSiteStore } from '@/providers/siteProvider';
import Layout from '../layout/Layout';
import NotionPage from '@/components/NotionPage';
import ShareBar from '@/components/ShareBar';
import Comment from '@/components/Comment';
import { useShallow } from 'zustand/react/shallow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useCallback } from 'react';
import ArticleLock from '@/components/ArticleLock';

const Article = () => {
  const { post, isLock } = useSiteStore(
    useShallow((state) => ({
      post: state.post,
      isLock: state.isLock,
    })),
  );
  const tagOptions = useSiteStore((state) => state.tagOptions);
  const tagColor = useCallback(
    (tag: string) => {
      return tagOptions.find((t) => t.name === tag)?.color || 'gray';
    },
    [tagOptions],
  );

  return (
    <Layout>
      {isLock && <ArticleLock />}

      {!isLock && post && (
        <Stack id="article-wrapper" spacing={2}>
          <Typography variant="h3" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="subtitle1">
            {dayjs(post?.date).format('YYYY-MM-DD')}
          </Typography>
          <Stack direction="row" spacing={1}>
            {post?.tags &&
              post?.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  style={{
                    backgroundColor: `var(--notion-item-${tagColor(tag)})`,
                    color: `var(--notion-item-text-${tagColor(tag)})`,
                  }}
                />
              ))}
          </Stack>
          <NotionPage post={post} />
          <ShareBar post={post} />
          <Comment />
        </Stack>
      )}
    </Layout>
  );
};

export default Article;
