import dynamic from 'next/dynamic';
import * as ThemeComponents from '@theme-components';
import { useRouter } from 'next/router';
import { useStyleStore } from '@/providers/styleProvider';

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
  const theme = useStyleStore((state) => state.theme);

  const layoutName = (layoutNameMapping[router.pathname] ||
    'PageNotFound') as keyof typeof ThemeComponents;

  return theme
    ? dynamic(() => import(`themes/${theme}`).then((m) => m[layoutName]), {
        ssr: true,
      })
    : ThemeComponents[layoutName];
};
