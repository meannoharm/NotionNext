import Layout from '../layout/Layout';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'next-i18next';
import { useSiteStore } from '@/providers/siteProvider';
import SearchInput from '../components/SearchInput';
import Stack from '@mui/material/Stack';
import PostList from '../components/PostLists';

const SearchDetail = () => {
  const keyword = useSiteStore((state) => state.keyword);
  const { t } = useTranslation('nav');

  return (
    <Layout>
      <Stack spacing={2}>
        <Typography variant="h4">
          {t('nav:search')}:{keyword}
        </Typography>
        <SearchInput />
        <PostList />
      </Stack>
    </Layout>
  );
};

export default SearchDetail;
