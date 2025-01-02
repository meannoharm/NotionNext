import Layout from '../layout/Layout';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'next-i18next';
import { useSiteStore } from '@/providers/siteProvider';
import SearchInput from '../components/SearchInput';
import Stack from '@mui/material/Stack';
import PostList from '../components/PostLists';
import { useEffect } from 'react';
import markText from '@/utils/markText';

const SearchDetail = () => {
  const keyword = useSiteStore((state) => state.keyword);
  const { t } = useTranslation('nav');

  useEffect(() => {
    markText('#posts-wrapper', keyword, {
      element: 'span',
      className: 'text-red-500 border-b border-dashed',
    });
  }, [keyword]);

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
