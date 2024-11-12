import BLOG from '@/blog.config';
import dynamic from 'next/dynamic';
import { useSearchParams, usePathname } from 'next/navigation';
import * as ThemeComponents from '@theme-components';
import { useRouter } from 'next/router';

/**
 * Route path-to-layout mapping
 */
const layoutNameMapping: Record<string, string> = {
  '/': 'Home',
  '/archive': 'Archive',
  '/page/[page]': 'Page',
  '/category': 'Category',
  '/category/[category]': 'CategoryDetail',
  '/category/[category]/page/[page]': 'CategoryPage',
  '/tag': 'Tag',
  '/tag/[tag]': 'TagDetail',
  '/tag/[tag]/page/[page]': 'TagPage',
  '/search': 'Search',
  '/search/[keyword]': 'SearchDetail',
  '/search/[keyword]/page/[page]': 'SearchPage',
  '/[prefix]': 'Prefix',
  '/[prefix]/[slug]': 'PrefixSlug',
  '/404': 'PageNotFound',
};

export const useLayout = (): React.ComponentType => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const theme = searchParams.get('theme') || BLOG.THEME;
  const layoutName = layoutNameMapping[router.pathname];

  return theme !== BLOG.THEME
    ? dynamic(() => import(`@/themes/${theme}`).then((m) => m[layoutName]), {
        ssr: true,
      })
    : ThemeComponents[layoutName];
};
