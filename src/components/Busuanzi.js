import busuanzi from '@/lib/busuanzi';
import { useStyleStore } from '@/providers/styleProvider';
import React from 'react';
import { useRouter } from 'next/router';

let path = '';

export default function Busuanzi() {
  const theme = useStyleStore((state) => state.theme);
  const Router = useRouter();
  Router.events.on('routeChangeComplete', (url) => {
    if (url !== path) {
      path = url;
      busuanzi.fetch();
    }
  });

  // 更换主题时更新
  React.useEffect(() => {
    if (theme) {
      busuanzi.fetch();
    }
  }, [theme]);
  return null;
}
