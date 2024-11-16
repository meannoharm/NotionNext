import LayoutBase from '../layout/LayoutBase';
import { ContextWrapper } from '../providers';
import { useTranslation } from 'next-i18next';

import { type FC } from 'react';
import type { ThemePageNotFoundProps } from '@/types';
/**
 * 404 页面
 * @param {*} props
 * @returns
 */
const PageNotFound: FC<ThemePageNotFoundProps> = (props) => {
  const { t } = useTranslation('common');
  return (
    <LayoutBase {...props}>
      <div className="flex flex-col items-center">
        <div className="mb-8 text-9xl">404</div>
        <div className="mb-2">{t('404')}</div>
        <div>{t('404-tips')}</div>
      </div>
    </LayoutBase>
  );
};

export default ContextWrapper(PageNotFound);
