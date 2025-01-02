import Layout from '../layout/Layout';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'next-i18next';
import { useSiteStore } from '@/providers/siteProvider';
import TagList from '../components/TagList';
import { useShallow } from 'zustand/react/shallow';
import PostList from '../components/PostLists';

const TagDetail = () => {
  const { siteInfo, tag } = useSiteStore(
    useShallow((state) => ({
      siteInfo: state.siteInfo,
      tag: state.tag,
    })),
  );
  const { t } = useTranslation('nav');

  return (
    <Layout>
      <Stack spacing={2}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            {siteInfo.title}
          </Link>
          <Link underline="hover" color="inherit" href="/tag">
            {t('tags')}
          </Link>
          <Typography sx={{ color: 'text.primary' }}>{tag}</Typography>
        </Breadcrumbs>
        <TagList />
        <PostList />
      </Stack>
    </Layout>
  );
};

export default TagDetail;
