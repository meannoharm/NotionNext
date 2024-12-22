import { useRouter } from 'next/router';
import { useStyleStore } from '@/providers/styleProvider';
import { type ComponentType, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

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

const ThemeLayout = () => {
  const router = useRouter();
  const theme = useStyleStore((state) => state.theme);
  const [ThemeComponent, setThemeComponent] = useState<ComponentType>();

  const layoutName = layoutNameMapping[router.pathname] || 'PageNotFound';

  useEffect(() => {
    console.log(theme);
    const loadDynamicComponent = async () => {
      const component = dynamic(
        () => import(`themes/${theme}`).then((m) => m[layoutName]),
        {
          ssr: true,
        },
      );
      setThemeComponent(component);
    };

    loadDynamicComponent();
  }, [theme, layoutName]);

  return ThemeComponent ? <ThemeComponent /> : null;
};

export default ThemeLayout;
