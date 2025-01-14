import { getSiteData } from '@/lib/notion/getSiteData';
import { useEffect, type FC } from 'react';
import BLOG from 'blog.config';
import { useLayout } from '@/lib/theme';
import { isBrowser } from '@/lib/utils';
import { useTranslation } from 'next-i18next';
import dayjs from 'dayjs';
import { omit } from 'lodash';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import type { GetStaticProps } from 'next';
import type {
  PageMeta,
  ArchiveIndexProps,
  ThemeArchiveProps,
} from '../../types/page';
import type { Page } from '@/types/notion';

const ArchiveIndex: FC<ArchiveIndexProps> = (props) => {
  const { siteInfo } = props;
  const { t } = useTranslation('nav');

  // 根据页面路径加载不同Layout文件
  const Archive = useLayout() as FC<ThemeArchiveProps>;

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

export const getStaticProps: GetStaticProps<ArchiveIndexProps> = async ({
  locale,
}) => {
  const globalData = await getSiteData('archive-index');

  const posts = globalData.allPages?.filter(
    (page) => page.type === 'Post' && page.status === 'Published',
  ) as Page[];

  const archivePosts: Record<string, Page[]> = {};
  posts
    .sort((a, b) => (dayjs(b.publishDate).isAfter(a.publishDate) ? 1 : -1))
    .forEach((post) => {
      const date = dayjs(post.publishDate).format('YYYY-MM');
      if (!archivePosts[date]) archivePosts[date] = [];
      archivePosts[date].push(post);
    });

  return {
    props: {
      ...omit(globalData, 'allPages'),
      posts,
      archivePosts,
      ...(await serverSideTranslations(locale as string)),
    },
    revalidate: BLOG.NEXT_REVALIDATE_SECOND,
  };
};

export default ArchiveIndex;
