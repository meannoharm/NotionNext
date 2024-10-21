import LayoutBase from '../layout/LayoutBase';

import type { FC } from 'react';

export interface PageNotFoundProps {}

/**
 * 404 页面
 * @param {*} props
 * @returns
 */
const PageNotFound: FC<PageNotFoundProps> = (props) => {
  return <LayoutBase {...props}>404 Not found.</LayoutBase>;
};

export default PageNotFound;
