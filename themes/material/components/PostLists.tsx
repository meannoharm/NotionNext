import { useTranslation } from 'react-i18next';
import PostCard from './PostCard';
import Stack from '@mui/material/Stack';
import { useConfigStore } from '@/providers/configProvider';
import { useSiteStore } from '@/providers/siteProvider';
import { useRouter } from 'next/router';
import { useShallow } from 'zustand/react/shallow';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';

export default function PostList() {
  const { posts, page, postCount } = useSiteStore(
    useShallow((state) => ({
      posts: state.posts,
      page: state.page,
      postCount: state.postCount,
    })),
  );
  const { POSTS_PER_PAGE, POST_LIST_STYLE } = useConfigStore(
    useShallow((state) => ({
      POSTS_PER_PAGE: state.POSTS_PER_PAGE,
      POST_LIST_STYLE: state.POST_LIST_STYLE,
    })),
  );
  const { t } = useTranslation('common');
  const router = useRouter();

  const totalPage = Math.ceil(postCount / POSTS_PER_PAGE);

  return (
    <Stack spacing={2}>
      <Box id="posts-wrapper">
        <Stack spacing={2}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Stack>
      </Box>
      {POST_LIST_STYLE === 'page' && (
        <Box display="flex" justifyContent="flex-end" width="100%">
          <Pagination page={page} count={totalPage} />
        </Box>
      )}
    </Stack>
  );
}
