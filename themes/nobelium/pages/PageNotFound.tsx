import LayoutBase from '../layout/LayoutBase';
import { useTranslation } from 'next-i18next';

import { type FC } from 'react';
/**
 * 404 页面
 * @param {*} props
 * @returns
 */
const PageNotFound: FC = () => {
  const { t } = useTranslation('common');
  return (
    <LayoutBase>
      <div className="flex flex-col items-center">
        <div className="mb-8 text-9xl">404</div>
        <div className="mb-2">{t('404')}</div>
        <div>{t('404_tips')}</div>
      </div>
    </LayoutBase>
  );
};

export default PageNotFound;
