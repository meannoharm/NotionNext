import { getSiteData } from '@/utils/notion/getSiteData';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CommonHead from 'components/CommonHead';
import { useSiteStore } from 'providers/siteProvider';
import { omit } from 'lodash';
import { useEffect, type FC } from 'react';
import ThemeLayout from 'components/ThemeLayout';

import type { PageNotFoundIndexProps, PageMeta } from '@/types';
import type { GetStaticProps } from 'next';

/**
 * 404
 * @param {*} props
 * @returns
 */
const NoFound: FC<PageNotFoundIndexProps> = (props) => {
  const updateSiteDataState = useSiteStore(
    (state) => state.updateSiteDataState,
  );
  const { siteInfo } = props;

  useEffect(() => {
    updateSiteDataState(props);
  }, [props]);

  const pageMeta: PageMeta = {
    title: `${props?.siteInfo?.title} | 页面找不到啦`,
    description: '404 page not found',
    slug: '',
    type: 'website',
    image: siteInfo?.pageCover,
  };

  return (
    <>
      <CommonHead pageMeta={pageMeta} />
      <ThemeLayout />
    </>
  );
};

export const getStaticProps: GetStaticProps<PageNotFoundIndexProps> = async ({
  locale,
}) => {
  const props = (await getSiteData('404')) || {};
  return {
    props: {
      ...omit(props, 'allPages'),
      ...(await serverSideTranslations(locale as string)),
    },
  };
};

export default NoFound;
