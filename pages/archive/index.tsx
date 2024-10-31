import { getGlobalData } from '@/lib/notion/getNotionData';
import { useEffect, type FC } from 'react';
import BLOG from '@/blog.config';
import { useRouter } from 'next/router';
import { getLayoutByTheme } from '@/themes/theme';
import { isBrowser } from '@/lib/utils';
import { formatDateFmt } from '@/lib/formatDate';
import { useTranslation } from 'next-i18next';

import type { GetStaticProps } from 'next';
import type { PageMeta, ArchiveIndexProps } from '../types';
import type { ArchiveComponent } from '@/themes/types';

const ArchiveIndex: FC<ArchiveIndexProps> = (props) => {
  const { siteInfo } = props;
  const { t } = useTranslation('nav');

  // 根据页面路径加载不同Layout文件
  const Archive = getLayoutByTheme(useRouter()) as ArchiveComponent;

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

  return <Archive pageMeta={pageMeta} {...props} />;
};

export const getStaticProps: GetStaticProps<ArchiveIndexProps> = async () => {
  const props = await getGlobalData('archive-index');

  const posts = props.allPages?.filter(
    (page) => page.type === 'Post' && page.status === 'Published',
  ) as PageInfo[];

  const archivePosts: Record<string, PageInfo[]> = {};
  posts
    .sort((a, b) => b.publishDate - a.publishDate)
    .forEach((post) => {
      const date = formatDateFmt(post.publishDate, 'yyyy-MM');
      if (!archivePosts[date]) archivePosts[date] = [];
      archivePosts[date].push(post);
    });

  return {
    props: {
      ...props,
      posts,
      archivePosts,
    },
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND, 10),
  };
};

export default ArchiveIndex;
