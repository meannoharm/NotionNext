import Layout from '../layout/Layout';
import CategoryList from '@/components/CategoryList';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'next-i18next';
import { useSiteStore } from '@/providers/siteProvider';

const Home = () => {
  const siteInfo = useSiteStore((state) => state.siteInfo);
  const { t } = useTranslation('nav');

  return (
    <Layout>
      <Stack spacing={2}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            {siteInfo.title}
          </Link>
          <Typography sx={{ color: 'text.primary' }}>
            {t('category')}
          </Typography>
        </Breadcrumbs>
        <CategoryList />
      </Stack>
    </Layout>
  );
};

export default Home;
