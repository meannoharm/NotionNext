import '@/styles/input.css';
import '@/styles/global.css';
import '@/styles/notion.css';
// used for rendering notion component
import 'katex/dist/katex.min.css';
import 'prismjs/themes/prism-coy.css';
import '@/styles/prism-theme.css';
import { appWithTranslation } from 'next-i18next';
import Progress from '@/components/NProgress';
import ExternalPlugins from '@/components/ExternalPlugins';
import { StyleProvider } from '@/providers/styleProvider';
import { SiteStoreProvider } from '@/providers/siteProvider';
import { ConfigProvider } from '@/providers/configProvider';

import type { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => {

  return (
    <StyleProvider>
      <SiteStoreProvider>
        <ConfigProvider>
          <Component {...pageProps} />
          <Progress />
          <ExternalPlugins {...pageProps} />
        </ConfigProvider>
      </SiteStoreProvider>
    </StyleProvider>
  );
};

export default appWithTranslation(MyApp);
