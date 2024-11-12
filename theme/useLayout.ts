import BLOG from '@/blog.config';
import dynamic from 'next/dynamic';
import { useSearchParams, usePathname } from 'next/navigation';
import * as ThemeComponents from '@theme-components';

/**
 * Route path-to-layout mapping
 */
const layoutMapping: Record<string, string> = {
  '/': 'Home',
  '/archive': 'Archive',
  '/page/[page]': 'PostList',
  '/category': 'Category',
  '/category/[category]': 'PostList',
  '/category/[category]/page/[page]': 'PostList',
  '/tag': 'Tag',
  '/tag/[tag]': 'PostList',
  '/tag/[tag]/page/[page]': 'PostList',
  '/search': 'Search',
  '/search/[keyword]': 'Search',
  '/search/[keyword]/page/[page]': 'Search',
  '/404': 'PageNotFound',
};

/**
 * Gets the layout name by the provided route path.
 * @param pathname The route pathname
 * @returns Corresponding layout name
 */
export const getLayoutNameByPathName = (pathname: string): string =>
  layoutMapping[pathname] || 'Post';

/**
 * Loads the theme layout component based on the current theme.
 * @returns Layout component
 */
export const useLayout = (): React.ComponentType => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const theme = searchParams.get('theme') || BLOG.THEME;
  const layout = getLayoutNameByPathName(pathname);

  return theme !== BLOG.THEME
    ? dynamic(() => import(`@/themes/${theme}`).then((m) => m[layout]), {
        ssr: true,
      })
    : ThemeComponents[layout];
};
