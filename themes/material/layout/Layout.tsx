import Header from '../components/Header';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Footer from '../components/Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useStyleStore } from '@/providers/styleProvider';
import { useMemo, type FC, type ReactNode } from 'react';

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
      <CssBaseline />
      <Header />
      <Container maxWidth="lg">
        <Box my={4}>{children}</Box>
      </Container>
      <Footer />
    </ThemeProvider>
  );
};

export default Layout;
