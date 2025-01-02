import React, { useMemo } from 'react';
import { Box, Container, Typography } from '@mui/material';
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
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container>
        <Typography variant="body1">
          {' '}
          © {AUTHOR} {copyrightDate}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Trans
            i18nKey="copyright-notice"
            t={t}
            components={{
              link: (
                <a href={LICENSE_URL} target="_blank">
                  {LICENSE}
                </a>
              ),
            }}
          />
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
