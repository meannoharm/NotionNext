import { getGlobalData } from '@/lib/notion/getNotionData';
import BLOG from '@/blog.config';
import { useRouter } from 'next/router';
import { getLayoutByTheme } from '@/themes/theme';
import { useTranslation } from 'next-i18next';

/**
 * 标签首页
 * @param {*} props
 * @returns
 */
const TagIndex = (props) => {
  const { siteInfo } = props;
  const { t } = useTranslation('common');

  // 根据页面路径加载不同Layout文件
  const Layout = getLayoutByTheme(useRouter());

  const meta = {
    title: `${t('tags')} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'tag',
    type: 'website',
  };
  props = { ...props, meta };

  return <Layout {...props} />;
};

export async function getStaticProps() {
  const from = 'tag-index-props';
  const props = await getGlobalData(from);
  delete props.allPages;
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND),
  };
}

export default TagIndex;
