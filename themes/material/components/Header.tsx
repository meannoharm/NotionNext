import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useSiteStore } from '@/providers/siteProvider';
import Avatar from '@mui/material/Avatar';
import NavButton from './NavButton';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';

export default function Header() {
  const customNav = useSiteStore((state) => state.navList);
  const siteInfo = useSiteStore((state) => state.siteInfo);
  const router = useRouter();
  const { t } = useTranslation('search');

  const backToHome = () => {
    router.push('/');
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.push(`/search/${e.currentTarget.value}`);
    }
  };

  const disappearTrigger = useScrollTrigger({
    threshold: 600,
  });

  const elevateTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <Box component="header" sx={{ mb: 4 }}>
      <Slide appear={false} direction="down" in={!disappearTrigger}>
        <AppBar position="fixed" elevation={elevateTrigger ? 4 : 0}>
          <Toolbar>
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={backToHome}
            >
              {siteInfo.icon && (
                <Avatar
                  src={siteInfo.icon}
                  alt={siteInfo.title}
                  sx={{ width: 24, height: 24, marginRight: 2 }}
                />
              )}
              <Typography variant="h6" noWrap component="div">
                {siteInfo.title}
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {customNav.map((nav) => (
                <NavButton key={nav.id} nav={nav} />
              ))}
            </Box>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={t('search_articles')}
                inputProps={{ 'aria-label': 'search' }}
                onKeyDown={handleOnKeyDown}
              />
            </Search>
          </Toolbar>
        </AppBar>
      </Slide>
      <Toolbar id="back-to-top-anchor" />
    </Box>
  );
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));
