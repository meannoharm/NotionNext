import { getGlobalData } from '@/lib/notion/getNotionData';
import { useLayout } from '@/theme';

import type { FC } from 'react';
import type {
  PageNotFoundIndexProps,
  PageMeta,
  ThemePageNotFoundProps,
} from '@/types';
import type { GetStaticProps } from 'next';

/**
 * 404
 * @param {*} props
 * @returns
 */
const NoFound: FC<PageNotFoundIndexProps> = (props) => {
  const { siteInfo } = props;
  const pageMeta: PageMeta = {
    title: `${props?.siteInfo?.title} | 页面找不到啦`,
    description: '404 page not found',
    slug: '',
    type: 'website',
    image: siteInfo?.pageCover,
  };

  // 根据页面路径加载不同Layout文件
  const Layout = useLayout() as FC<ThemePageNotFoundProps>;

  return <Layout pageMeta={pageMeta} {...props} />;
};

export const getStaticProps: GetStaticProps<
  PageNotFoundIndexProps
> = async () => {
  const props = (await getGlobalData('404')) || {};
  return { props };
};

export default NoFound;
