import { useSiteStore } from '@/providers/siteProvider';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const SearchInput = () => {
  const router = useRouter();
  const keyword = useSiteStore((state) => state.keyword);
  const { t } = useTranslation(['nav', 'search']);
  const [text, setText] = useState('');

  useEffect(() => {
    setText(keyword);
  }, [keyword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSearch = () => {
    if (text.trim()) {
      router.push(`/search/${text}`);
    }
  };

  return (
    <Paper
      component="form"
      sx={{
        p: '4px 24px',
        alignItems: 'center',
        display: 'flex',
        width: '100%',
      }}
    >
      <InputBase
        fullWidth
        placeholder={t('search:search_placeholder')}
        value={text}
        id="search"
        onChange={handleChange}
      />
      <IconButton
        type="button"
        sx={{ p: '10px' }}
        aria-label="search"
        onClick={handleSearch}
      >
        <i className="fas fa-search" />
      </IconButton>
    </Paper>
  );
};

export default SearchInput;
