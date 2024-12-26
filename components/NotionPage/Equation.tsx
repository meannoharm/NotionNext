import KaTeX from 'katex';
import 'katex/contrib/mhchem';
import { useEffect, useState } from 'react';
import { getBlockTitle } from 'notion-utils';
import { useNotionContext } from 'react-notion-x';

import type { FC } from 'react';
import type { EquationBlock } from '@/types/notion';

/**
 * 数学公式
 * @param {*} param0
 * @returns
 */
const Equation: FC<{
  block: EquationBlock;
  math?: string;
  inline?: boolean;
  className?: string;
}> = ({ block, math, inline = false, className }) => {
  const { recordMap } = useNotionContext();
  math = math || getBlockTitle(block, recordMap);

  const [state, setState] = useState({ innerHtml: '' });

  useEffect(() => {
    try {
      const innerHtml = KaTeX.renderToString(math, {
        displayMode: true,
        throwOnError: false,
        strict: false,
      });
      setState({ innerHtml });
    } catch (error) {
      if (error instanceof KaTeX.ParseError || error instanceof TypeError) {
        setState({ innerHtml: error.message });
      } else {
        throw error;
      }
    }
  }, [math]);

  return (
    <span
      role="button"
      tabIndex={0}
      className={`notion-equation ${inline ? 'notion-equation-inline' : 'notion-equation-block'} ${className}`}
      dangerouslySetInnerHTML={{ __html: state.innerHtml }}
    />
  );
};

export default Equation;
