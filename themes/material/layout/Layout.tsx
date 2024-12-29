import Header from '../components/Header';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Footer from '../components/Footer';

import { type FC, type ReactNode } from 'react';

const Layout: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <Header />
      <Container maxWidth="lg">
        <Box my={4}>{children}</Box>
      </Container>
      <Footer />
    </>
  );
};

export default Layout;
