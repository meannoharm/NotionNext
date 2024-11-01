import { getGlobalData } from '@/lib/notion/getNotionData';
import { useGlobal } from '@/lib/global';
import { useRouter } from 'next/router';
import { getLayoutByTheme } from '@/themes/theme';

import type {FC } from 'react';
import type {PageNotFoundIndexProps} from '@/pages/type'
import type { PageNotFoundComponent } from '@/themes/types';
import type { GetStaticProps } from 'next';

/**
 * 404
 * @param {*} props
 * @returns
 */
const NoFound: FC<PageNotFoundIndexProps> = (props) => {
  const { siteInfo } = useGlobal();
  const meta = {
    title: `${props?.siteInfo?.title} | 页面找不到啦`,
    image: siteInfo?.pageCover,
  };

  props = { ...props, meta };

  // 根据页面路径加载不同Layout文件
  const Layout = getLayoutByTheme(useRouter()) as PageNotFoundComponent;

  return <Layout {...props} />;
};

export const getStaticProps:GetStaticProps<PageNotFoundIndexProps> = async () => {
  const props = (await getGlobalData('404')) || {};
  return { props };
}

export default NoFound;
