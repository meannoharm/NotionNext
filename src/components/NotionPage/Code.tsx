import { CodeBlock } from '@/types/notion';
import Prism from 'prismjs';
import BLOG from 'blog.config';
import Script from 'next/script';
import { Code as CodeRender } from 'react-notion-x/build/third-party/code';

import type { FC } from 'react';

const Code: FC<{
  block: CodeBlock;
  defaultLanguage?: string;
  className?: string;
}> = (props) => {
  const CDN = BLOG.CDN;
  const prismJsAutoLoader = `https://${CDN}/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js`;
  const languagesPath = `https://${CDN}/prism/1.29.0/components/`;

  const handleLoad = () => {
    if (window.Prism.plugins.autoloader) {
      window.Prism.plugins.autoloader.languages_path = languagesPath;
    }
    Prism.highlightAll();
  };

  return (
    <>
      <CodeRender {...props} />
      <Script src={prismJsAutoLoader} onLoad={handleLoad} />
    </>
  );
};

export default Code;
