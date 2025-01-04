import Header from '../components/Header';
import Box from '@mui/material/Box';

import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Footer from '../components/Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useStyleStore } from '@/providers/styleProvider';
import { useMemo, type FC, type ReactNode } from 'react';
import Grid from '@mui/material/Grid2';
import SideBar from '../components/SideBar';
import ScrollTop from '../components/ScrollTop';

const Layout: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const isDarkMode = useStyleStore((state) => state.isDarkMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
        },
      }),
    [isDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        id="theme-material"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <CssBaseline />
        <Header />
        <Box sx={{ flex: '1 0 auto' }}>
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid size={3}>
                <SideBar />
              </Grid>
              <Grid size={9}>
                <Box component="main" my={4}>
                  {children}
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Footer />
        <ScrollTop />
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
