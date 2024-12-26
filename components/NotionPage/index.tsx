import { NotionComponents, NotionRenderer } from 'react-notion-x';
import dynamic from 'next/dynamic';
import React, { type FC, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { mapImgUrl } from 'lib/notion/mapImage';
import { NOTION_PAGE_ID, SITE_URL } from '@/constants';

import type { Page } from '@/types/notion';
import { idToUuid } from 'notion-utils';
import { useStyleStore } from 'providers/styleProvider';

const Code = dynamic(
  () => import('components/NotionPage/Code').then(async (m) => m),
  { ssr: false },
);

const Equation = dynamic(
  () => import('components/NotionPage/Equation').then(async (m) => m),
  { ssr: false },
);

const Tweet = dynamic(
  () => import('components/NotionPage/Tweet').then(async (m) => m),
  { ssr: false },
);

const Pdf = dynamic(
  () => import('components/NotionPage/Pdf').then(async (m) => m),
  { ssr: false },
);

const Collection = dynamic(
  () =>
    import('react-notion-x/build/third-party/collection').then(
      (m) => m.Collection,
    ),
  { ssr: true },
);

const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
  { ssr: false },
);

const mapPageUrl = (pageId: string) => {
  if (pageId === idToUuid(NOTION_PAGE_ID)) {
    return '/';
  } else {
    return `/${pageId}`;
  }
};

const NotionPage: FC<{
  post: Page;
  className?: string;
}> = ({ post, className = '' }) => {
  const isDarkMode = useStyleStore((state) => state.isDarkMode);
  const domain = useMemo(() => {
    try {
      const url = new URL(SITE_URL);
      return url.hostname;
    } catch {
      throw new Error('Invalid SITE_URL');
    }
  }, []);

  const components = useMemo<Partial<NotionComponents>>(
    () => ({
      nextLegacyImage: Image,
      nextLink: Link,
      Code,
      Collection,
      Equation,
      Pdf,
      Modal,
      Tweet,
    }),
    [],
  );

  useEffect(() => {
    setTimeout(() => {
      // 跳转到指定标题
      const needToJumpToTitle = window.location.hash;
      if (needToJumpToTitle) {
        const tocNode = document.getElementById(
          window.location.hash.substring(1),
        );
        if (tocNode && tocNode?.className?.indexOf('notion') > -1) {
          tocNode.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      }
    }, 180);
  }, []);

  return post && post.blockMap ? (
    <div id="notion-article" className={`mx-auto overflow-hidden ${className}`}>
      <NotionRenderer
        recordMap={post.blockMap}
        rootPageId={NOTION_PAGE_ID}
        rootDomain={domain}
        darkMode={isDarkMode}
        mapImageUrl={mapImgUrl}
        mapPageUrl={mapPageUrl}
        previewImages={!!post.blockMap.preview_images}
        components={components}
      />
    </div>
  ) : (
    post?.summary || null
  );
};

export default NotionPage;
