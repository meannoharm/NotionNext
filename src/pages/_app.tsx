import '@/styles/input.css';
import '@/styles/global.css';
import '@/styles/notion.css';

// used for rendering notion component
import 'katex/dist/katex.min.css';
import 'prismjs/themes/prism-coy.css';
import '@/styles/prism-theme.css';

import { GlobalContextProvider } from '@/context/global';
import { appWithTranslation } from 'next-i18next';
import { isBrowser, loadExternalResource } from '@/utils';
import BLOG from 'blog.config';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { initNProgress } from '@/components/NProgress';
import '@/styles/nprogress.css';
import ExternalPlugins from '@/components/ExternalPlugins';

import type { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => {
  if (isBrowser) {
    AOS.init();
    initNProgress();
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
    <GlobalContextProvider {...pageProps}>
      <Component {...pageProps} />
      <ExternalPlugins {...pageProps} />
    </GlobalContextProvider>
  );
};

export default appWithTranslation(MyApp);
