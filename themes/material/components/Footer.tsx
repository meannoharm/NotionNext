import React, { useMemo } from 'react';
import { Box, Container, Link, Typography } from '@mui/material';
import { useConfigStore } from '@/providers/configProvider';
import { Trans, useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { SINCE, AUTHOR, LICENSE, LICENSE_URL } = useConfigStore(
    useShallow((state) => ({
      SINCE: state.SINCE,
      AUTHOR: state.AUTHOR,
      LICENSE: state.LICENSE,
      LICENSE_URL: state.LICENSE_URL,
    })),
  );
  const { t } = useTranslation('common');

  const copyrightDate = useMemo(() => {
    if (SINCE && SINCE < currentYear) {
      return SINCE + '-' + currentYear;
    }
    return currentYear;
  }, [SINCE, currentYear]);

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
      }}
    >
      <Container sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {AUTHOR} {copyrightDate}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Trans
            i18nKey="copyright-notice"
            t={t}
            components={{
              link: (
                <Link color="inherit" href={LICENSE_URL}>
                  {LICENSE}
                </Link>
              ),
            }}
          />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Trans
            i18nKey="powered-by"
            t={t}
            components={{
              link: (
                <Link
                  color="inherit"
                  href="https://www.github.com/czgaotian/notion-next-base"
                >
                  Notion Next Base
                </Link>
              ),
            }}
          />
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
