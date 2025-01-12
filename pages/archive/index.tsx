import { getSiteData } from '@/utils/notion/getSiteData';
import { useEffect, type FC } from 'react';
import { isBrowser } from '@/utils';
import { useTranslation } from 'next-i18next';
import dayjs from 'dayjs';
import { omit } from 'lodash';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSiteStore } from 'providers/siteProvider';
import CommonHead from '@/components/CommonHead';
import ThemeLayout from '@/components/ThemeLayout';

import type { GetStaticProps } from 'next';
import type { PageMeta, ArchiveIndexProps } from '../../types/page';
import type { Archive } from '@/types/notion';

const ArchiveIndex: FC<ArchiveIndexProps> = (props) => {
  const { siteInfo } = props;
  const { t } = useTranslation('nav');
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );
  const updateArchive = useSiteStore((state) => state.updateArchive);

  useEffect(() => {
    updateSiteDataState(props);
    updateArchive(props.archive);
  }, [props]);

  useEffect(() => {
    if (isBrowser) {
      const anchor = window.location.hash;
      if (anchor) {
        setTimeout(() => {
          const anchorElement = document.getElementById(anchor.substring(1));
          if (anchorElement) {
            anchorElement.scrollIntoView({
              block: 'start',
              behavior: 'smooth',
            });
          }
        }, 300);
      }
    }
  }, []);

  const pageMeta: PageMeta = {
    title: `${t('archive')} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'archive',
    type: 'website',
  };

  return (
    <>
      <CommonHead pageMeta={pageMeta} />
      <ThemeLayout />
    </>
  );
};

export const getStaticProps: GetStaticProps<ArchiveIndexProps> = async ({
  locale,
}) => {
  const props = await getSiteData('archive-index');

  const archive: Archive = {};
  props.publishedPosts
    .sort((a, b) => dayjs(b.date).diff(dayjs(a.date)))
    .forEach((post) => {
      const date = dayjs(post.date).format('YYYY-MM');
      if (!archive[date]) archive[date] = [];
      archive[date].push(post);
    });

  return {
    props: {
      ...omit(props, 'allPages'),
      archive,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: props.config.NEXT_REVALIDATE_SECOND,
  };
};

export default ArchiveIndex;
