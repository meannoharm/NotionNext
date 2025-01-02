import Layout from '../layout/Layout';
import CategoryList from '@/components/CategoryList';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'next-i18next';
import { useSiteStore } from '@/providers/siteProvider';
import PostList from '../components/PostLists';
import { useShallow } from 'zustand/react/shallow';

const Home = () => {
  const { category, siteInfo } = useSiteStore(
    useShallow((state) => ({
      category: state.category,
      categoryOptions: state.categoryOptions,
      siteInfo: state.siteInfo,
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
          <Link underline="hover" color="inherit" href="/category">
            {t('category')}
          </Link>
          <Typography sx={{ color: 'text.primary' }}>{category}</Typography>
        </Breadcrumbs>
        <CategoryList />
        <PostList />
      </Stack>
    </Layout>
  );
};

export default Home;
