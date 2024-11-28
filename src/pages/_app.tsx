import '@/styles/input.css';
import '@/styles/global.css';
import '@/styles/notion.css';

// used for rendering notion component
import 'katex/dist/katex.min.css';
import 'prismjs/themes/prism-coy.css';
import '@/styles/prism-theme.css';

import { appWithTranslation } from 'next-i18next';
import { isBrowser, loadExternalResource } from '@/lib/utils';
import BLOG from 'blog.config';

import Progress from '@/components/NProgress';
import ExternalPlugins from '@/components/ExternalPlugins';

import type { AppProps } from 'next/app';
import { StyleProvider } from '@/providers/styleProvider';
import { SiteStoreProvider } from '@/providers/siteProvider';

const MyApp = ({ Component, pageProps }: AppProps) => {
  if (isBrowser) {
    // 静态导入本地自定义样式
    loadExternalResource('/css/custom.css', 'css');
    loadExternalResource('/js/custom.js', 'js');

    // 导入外部自定义脚本
    if (BLOG.CUSTOM_EXTERNAL_JS && BLOG.CUSTOM_EXTERNAL_JS.length > 0) {
      for (const url of BLOG.CUSTOM_EXTERNAL_JS) {
        loadExternalResource(url, 'js');
      }
    }

    // 导入外部自定义样式
    if (BLOG.CUSTOM_EXTERNAL_CSS && BLOG.CUSTOM_EXTERNAL_CSS.length > 0) {
      for (const url of BLOG.CUSTOM_EXTERNAL_CSS) {
        loadExternalResource(url, 'css');
      }
    }
  }

  return (
    <StyleProvider>
      <SiteStoreProvider>
        <Component {...pageProps} />
        <Progress />
        <ExternalPlugins {...pageProps} />
      </SiteStoreProvider>
    </StyleProvider>
  );
};

export default appWithTranslation(MyApp);
