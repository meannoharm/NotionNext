import { useGlobal } from '@/lib/global';
import Collapse from '@/components/Collapse';
import { useRef, useState } from 'react';
import { supportedLocales } from '@/lib/lang';
import { Language } from '@/components/HeroIcons';
import useToggleClickOutSide from '@/hooks/useToggleClickOutSide';

import type { RefObject } from 'react';

/**
 * 语言切换
 */
export default function LanguageSwitchButton() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null) as RefObject<HTMLDivElement>;
  const { lang, updateLang } = useGlobal();

  useToggleClickOutSide(menuRef, () => {
    setIsOpen(false);
  });

  const changeLanguage = (language: string) => {
    if (language !== lang) updateLang(language);
  };

  return (
    <div className="relative" onClick={() => setIsOpen(!isOpen)} ref={menuRef}>
      <div
        className={`flex h-10 w-10 transform cursor-pointer items-center justify-center rounded-full text-gray-800 hover:bg-black hover:bg-opacity-10 dark:text-gray-200 dark:hover:bg-white dark:hover:bg-opacity-10`}
      >
        <Language className="h-5 w-5" />
      </div>
      <div
        className={`${isOpen ? 'visible top-10 opacity-100 ' : 'invisible top-8 opacity-0 '} absolute w-40 rounded border border-gray-100 bg-white drop-shadow-lg transition-all duration-300 dark:border-gray-800 dark:bg-black`}
      >
        <Collapse isOpen={isOpen}>
          {supportedLocales.map((lang) => (
            <div
              className="p-3 text-gray-700 transition-all duration-200  hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900"
              key={lang}
              onClick={() => changeLanguage(lang)}
            >
              {lang}
            </div>
          ))}
        </Collapse>
      </div>
    </div>
  );
}
