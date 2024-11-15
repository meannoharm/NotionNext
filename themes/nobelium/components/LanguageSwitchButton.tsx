import { useRouter } from 'next/router';
import Collapse from '@/components/Collapse';
import { useRef, useState } from 'react';
import { Language } from '@/components/HeroIcons';
import useToggleClickOutSide from '@/hooks/useToggleClickOutSide';
import nextI18NextConfig from 'next-i18next.config.js';

import type { RefObject } from 'react';

const displayMap: Record<string, string> = {
  'zh-CN': '简体中文',
  en: 'English',
};

/**
 * 语言切换
 */
export default function LanguageSwitchButton() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null) as RefObject<HTMLDivElement>;
  const router = useRouter();
  const { locales } = nextI18NextConfig.i18n;

  useToggleClickOutSide(menuRef, () => {
    setIsOpen(false);
  });

  const changeLanguage = (locale: string) => {
    router.push(
      {
        pathname: router.pathname,
        query: router.query,
      },
      router.asPath,
      { locale },
    );
  };

  return (
    <div className="relative" onClick={() => setIsOpen(!isOpen)} ref={menuRef}>
      <div
        className={`flex h-10 w-10 transform cursor-pointer items-center justify-center rounded-full text-gray-800 hover:bg-black hover:bg-opacity-10 dark:text-gray-200 dark:hover:bg-white dark:hover:bg-opacity-10`}
      >
        <Language className="h-5 w-5" />
      </div>
      <div
        className={`${isOpen ? 'top-10 block' : 'top-8 hidden'} absolute right-0 w-40 rounded border border-gray-100 bg-white drop-shadow-lg transition-all duration-300 dark:border-gray-800 dark:bg-black`}
      >
        <Collapse isOpen={isOpen}>
          {locales.map((locale) => (
            <div
              className="cursor p-3 text-gray-700 transition-all duration-200  hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900"
              key={locale}
              onClick={() => changeLanguage(locale)}
            >
              {displayMap[locale] || locale}
            </div>
          ))}
        </Collapse>
      </div>
    </div>
  );
}
