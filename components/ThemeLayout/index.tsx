import { useRouter } from 'next/router';
import { useStyleStore } from 'providers/styleProvider';
import { type ComponentType, useEffect, useState, Suspense } from 'react';
import Loading from '@/components/Loading';

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
    const loadTheme = async () => {
      const themeModule = await import(`themes/${theme}`).then(
        (module) => module[layoutName],
      );
      setThemeComponent(themeModule);
    };

    loadTheme();
  }, [theme, layoutName]);

  return (
    <Suspense fallback={<Loading />}>
      {ThemeComponent ? <ThemeComponent /> : null}
    </Suspense>
  );
};

export default ThemeLayout;
