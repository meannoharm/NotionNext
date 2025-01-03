import LayoutBase from '../layout/LayoutBase';
import PageNotFoundTip from '@/components/PageNotFoundTip';

import { type FC } from 'react';
/**
 * 404 页面
 * @param {*} props
 * @returns
 */
const PageNotFound: FC = () => {
  return (
    <LayoutBase>
      <PageNotFoundTip />
    </LayoutBase>
  );
};

export default PageNotFound;
