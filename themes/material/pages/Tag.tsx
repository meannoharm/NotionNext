import Layout from '../layout/Layout';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'next-i18next';
import { useSiteStore } from '@/providers/siteProvider';
import TagList from '../components/TagList';

const Tag = () => {
  const siteInfo = useSiteStore((state) => state.siteInfo);
  const { t } = useTranslation('nav');

  return (
    <Layout>
      <Stack spacing={2}>
        <Typography variant="h4">{t('tags')}</Typography>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            {siteInfo.title}
          </Link>
          <Typography sx={{ color: 'text.primary' }}>{t('tags')}</Typography>
        </Breadcrumbs>
        <TagList />
      </Stack>
    </Layout>
  );
};

export default Tag;
