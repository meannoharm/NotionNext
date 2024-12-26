// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentContext,
} from 'next/document';
import { FONT_AWESOME } from '@/constants';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="32x32" href="favicon.png" />
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="preload"
            href={FONT_AWESOME}
            as="style"
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href={FONT_AWESOME}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
