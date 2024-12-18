import { useRouter } from 'next/router';
import { useStyleStore } from '@/providers/styleProvider';
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

  const layoutName = layoutNameMapping[router.pathname] || 'PageNotFound';
  const Layout = dynamic(
    () =>
      import(`@notion-next-base-theme/${theme}`)
        .then((m) => {
          console.log('m', m);
          return m[layoutName];
        })
        .catch((e) => {
          console.error('error', e);
        }),
    {
      ssr: true,
    },
  );

  return <Layout />;
};

export default ThemeLayout;
