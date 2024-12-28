import Vercel from 'components/Vercel';
import { Trans, useTranslation } from 'next-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useConfigStore } from 'providers/configProvider';
import { useMemo } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { SINCE, AUTHOR, LICENSE, LICENSE_URL } = useConfigStore(
    useShallow((state) => ({
      SINCE: state.SINCE,
      AUTHOR: state.AUTHOR,
      LICENSE: state.LICENSE,
      LICENSE_URL: state.LICENSE_URL,
    })),
  );
  const { t } = useTranslation('common');

  const copyrightDate = useMemo(() => {
    if (SINCE && SINCE < currentYear) {
      return SINCE + '-' + currentYear;
    }
    return currentYear;
  }, [SINCE, currentYear]);

  return (
    <footer className="relative z-10 m-auto mt-6 w-full max-w-2xl flex-shrink-0 px-4 text-gray-600 transition-all dark:text-gray-400">
      <hr className="border-gray-200 dark:border-gray-800" />
      <div className="my-4 text-sm leading-6">
        <div className="flex flex-col items-center md:flex-row">
          <div className="mr-0 md:mr-2">
            © {AUTHOR} {copyrightDate}.
          </div>
          <div className="mb-2 mr-0 md:mb-0 md:mr-auto">
            <Trans
              i18nKey="copyright-notice"
              t={t}
              components={{
                link: (
                  <a href={LICENSE_URL} target="_blank">
                    {LICENSE}
                  </a>
                ),
              }}
            />
          </div>
          <Vercel />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
