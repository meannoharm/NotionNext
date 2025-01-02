import Layout from '../layout/Layout';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'next-i18next';
import { useSiteStore } from '@/providers/siteProvider';
import Box from '@mui/material/Box';
import { useShallow } from 'zustand/react/shallow';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

const Archive = () => {
  const { archive, siteInfo } = useSiteStore(
    useShallow((state) => {
      return {
        archive: state.archive,
        siteInfo: state.siteInfo,
      };
    }),
  );
  const { t } = useTranslation('nav');

  return (
    <Layout>
      <Stack spacing={2}>
        <Typography variant="h4">{t('archive')}</Typography>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            {siteInfo.title}
          </Link>
          <Typography sx={{ color: 'text.primary' }}>{t('archive')}</Typography>
        </Breadcrumbs>
        <Box>
          {' '}
          <div className="mb-10 min-h-screen w-full p-3  pb-20 md:py-12">
            {Object.keys(archive).map((archiveTitle) => (
              <Accordion defaultExpanded key={archiveTitle}>
                <AccordionSummary
                  expandIcon={<i className="fas fa-chevron-down" />}
                  aria-controls={`${archiveTitle}-content`}
                  id={archiveTitle}
                >
                  <Typography component="span">{archiveTitle}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {archive[archiveTitle].map((post) => (
                    <div key={post.slug}>
                      <Link href={`/post/${post.slug}`}>
                        <Typography>{post.title}</Typography>
                      </Link>
                    </div>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </Box>
      </Stack>
    </Layout>
  );
};

export default Archive;
