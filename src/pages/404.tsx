import { getSiteData } from '@/lib/notion/getSiteData';
import { useLayout } from '@/lib/theme';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import type { FC } from 'react';
import type { PageNotFoundIndexProps, PageMeta } from '@/types';
import type { GetStaticProps } from 'next';
import CommonHead from '@/components/CommonHead';
import { useSiteStore } from '@/providers/siteProvider';
import { omit } from 'lodash';

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

  updateSiteDataState(props);

  const pageMeta: PageMeta = {
    title: `${props?.siteInfo?.title} | 页面找不到啦`,
    description: '404 page not found',
    slug: '',
    type: 'website',
    image: siteInfo?.pageCover,
  };

  // 根据页面路径加载不同Layout文件
  const ThemeLayout = useLayout();

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
