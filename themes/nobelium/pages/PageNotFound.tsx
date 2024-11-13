import LayoutBase from '../layout/LayoutBase';
import { ContextWrapper } from '../providers';

import type { FC } from 'react';
import type { ThemePageNotFoundProps } from '@/pages/types';
/**
 * 404 页面
 * @param {*} props
 * @returns
 */
const PageNotFound: FC<ThemePageNotFoundProps> = (props) => {
  return <LayoutBase {...props}>404 Not found.</LayoutBase>;
};

export default ContextWrapper(PageNotFound);
