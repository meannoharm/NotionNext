import { useRouter } from 'next/router';
import { useStyleStore } from 'providers/styleProvider';
import { type ComponentType, useEffect, useState } from 'react';

/**
 * Route path-to-layout mapping
 */
const layoutNameMapping: Record<string, string> = {
  '/': 'Home',
  '/page/[page]': 'PostListPage',
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
    const loadTheme = async () => {
      const themeModule = await import(`@/themes/${theme}`).then(
        (module) => module[layoutName],
      );
      setThemeComponent(themeModule);
    };

    loadTheme();
  }, [theme, layoutName]);

  return ThemeComponent ? <ThemeComponent /> : null;
};

export default ThemeLayout;
