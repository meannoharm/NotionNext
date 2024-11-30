import BLOG from 'blog.config';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import * as ThemeComponents from '@theme-components';
import { useRouter } from 'next/router';

/**
 * Route path-to-layout mapping
 */
const layoutNameMapping: Record<string, string> = {
  '/': 'Home',
  '/page/[page]': 'Page',
  '/archive': 'Archive',
  '/category': 'Category',
  '/category/[category]': 'CategoryDetail',
  '/category/[category]/page/[page]': 'CategoryDetailPage',
  '/tag': 'Tag',
  '/tag/[tag]': 'TagDetail',
  '/tag/[tag]/page/[page]': 'TagDetailPage',
  '/search': 'Search',
  '/search/[keyword]': 'SearchDetail',
  '/search/[keyword]/page/[page]': 'SearchDetailPage',
  '/[...slug]': 'Article',
  '/404': 'PageNotFound',
};

export const useLayout = (): React.ComponentType<any> => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const theme = searchParams.get('theme') || BLOG.THEME;
  const layoutName = (layoutNameMapping[router.pathname] ||
    'PageNotFound') as keyof typeof ThemeComponents;

  return theme !== BLOG.THEME
    ? dynamic(() => import(`themes/${theme}`).then((m) => m[layoutName]), {
        ssr: true,
      })
    : ThemeComponents[layoutName];
};
