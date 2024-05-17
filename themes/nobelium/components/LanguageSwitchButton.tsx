import Collapse from '@/components/Collapse';
import { useRef, useState } from 'react';
import { supportedLocales } from '@/lib/lang';
import { Language } from '@/components/HeroIcons';
import useToggleClickOutSide from '@/hooks/useToggleClickOutSide';

/**
 * 语言切换
 */
export default function LanguageSwitchButton() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useToggleClickOutSide(menuRef, () => {
    setIsOpen(false);
  });

  return (
    <div className="relative" onClick={() => setIsOpen(true)} ref={menuRef}>
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full text-gray-800 hover:bg-black hover:bg-opacity-10 dark:text-gray-200 dark:hover:bg-white dark:hover:bg-opacity-10`}
      >
        <div className="h-5 w-5 transform cursor-pointer ">
          <Language />
        </div>
      </div>
      {isOpen && (
        <div className="absolute rounded border border-gray-100 bg-white drop-shadow-lg transition-all duration-300 dark:border-gray-800 dark:bg-black">
          <Collapse isOpen={isOpen}>
            {supportedLocales.map((lang) => (
              <div
                className="not:last-child:border-b-0 border-b py-3 pl-3  pr-6 tracking-widest text-gray-700 transition-all duration-200  hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900"
                key={lang}
              >
                {lang}
              </div>
            ))}
          </Collapse>
        </div>
      )}
    </div>
  );
}
