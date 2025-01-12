import { useSiteStore } from '@/providers/siteProvider';
import Layout from '../layout/Layout';
import NotionPage from '@/components/NotionPage';
import { useShallow } from 'zustand/react/shallow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import ArticleLock from '@/components/ArticleLock';
import { useConfigStore } from '@/providers/configProvider';
import Avatar from '@mui/material/Avatar';
import md5 from 'js-md5';
import TagList from '../components/TagList';
import NotionIcon from '@/components/NotionIcon';

const Article = () => {
  const { post, isLock } = useSiteStore(
    useShallow((state) => ({
      post: state.post,
      isLock: state.isLock,
    })),
  );
  const { EMAIL, AUTHOR } = useConfigStore(
    useShallow((state) => ({
      EMAIL: state.EMAIL,
      GITHUB_URL: state.GITHUB_URL,
      AUTHOR: state.AUTHOR,
    })),
  );

  return (
    <Layout>
      {isLock && <ArticleLock />}

      {!isLock && post && (
        <Stack id="article-wrapper" spacing={2}>
          <Typography variant="h3" gutterBottom>
            {post?.pageIcon && <NotionIcon icon={post?.pageIcon} />}
            {post.title}
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: 'center',
            }}
          >
            <Avatar
              alt={AUTHOR}
              src={`https://gravatar.com/avatar/${md5(EMAIL)}`}
              sx={{ width: 24, height: 24 }}
            />
            <Typography variant="subtitle1">{AUTHOR}</Typography>
            <Typography variant="subtitle1">
              {dayjs(post?.date).format('YYYY-MM-DD')}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            {post?.tags && <TagList tagList={post.tags} />}
          </Stack>
          <NotionPage post={post} />
        </Stack>
      )}
    </Layout>
  );
};

export default Article;
