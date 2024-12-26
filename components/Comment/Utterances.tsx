import { useConfigStore } from 'providers/configProvider';
import { useStyleStore } from 'providers/styleProvider';
import { useEffect, useRef } from 'react';

/**
 * 评论插件
 * @see https://utteranc.es/
 */
const Utterances = () => {
  const utterancesRef = useRef<HTMLDivElement>(null);
  const isDarkMode = useStyleStore((state) => state.isDarkMode);
  const UTTERANCES_REPO = useConfigStore((state) => state.UTTERANCES_REPO);

  useEffect(() => {
    if (utterancesRef.current) {
      utterancesRef.current.innerHTML = '';
    }

    const theme = isDarkMode ? 'github-dark' : 'github-light';
    const script = document.createElement('script');

    script.async = true;
    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('repo', UTTERANCES_REPO);
    script.setAttribute('issue-term', 'title');
    script.setAttribute('theme', theme);

    utterancesRef.current?.appendChild(script);
  }, [isDarkMode]);
  return <div id="comments" ref={utterancesRef} className="utterances"></div>;
};

export default Utterances;
