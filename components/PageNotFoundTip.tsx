import { useTranslation } from 'next-i18next';

const PageNotFoundTip = () => {
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 text-9xl">404</div>
      <div className="mb-2">{t('404')}</div>
      <div>{t('404_tips')}</div>
    </div>
  );
};

export default PageNotFoundTip;
