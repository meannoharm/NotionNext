import Layout from '../layout/Layout';
import { useTranslation } from 'next-i18next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SearchInput from '../components/SearchInput';

const Search = () => {
  const { t } = useTranslation(['nav', 'search']);

  return (
    <Layout>
      <Stack spacing={2}>
        <Typography variant="h4">{t('nav:search')}</Typography>
        <SearchInput />
      </Stack>
    </Layout>
  );
};

export default Search;
