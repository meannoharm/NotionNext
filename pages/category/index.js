import { getGlobalData } from '@/lib/notion/getNotionData';
import React from 'react';
import BLOG from '@/blog.config';
import { useRouter } from 'next/router';
import { getLayoutByTheme } from '@/themes/theme';
import { useTranslation } from 'next-i18next';

/**
 * 分类首页
 * @param {*} props
 * @returns
 */
export default function Category(props) {
  const { siteInfo } = props;
  const { t } = useTranslation('common');

  // 根据页面路径加载不同Layout文件
  const Layout = getLayoutByTheme(useRouter());

  const meta = {
    title: `${t('category')} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'category',
    type: 'website',
  };
  props = { ...props, meta };

  return <Layout {...props} />;
}

export async function getStaticProps() {
  const props = await getGlobalData({ from: 'category-index-props' });
  delete props.allPages;
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND),
  };
}
