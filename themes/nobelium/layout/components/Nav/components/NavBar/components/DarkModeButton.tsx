import { Moon, Sun } from '@/components/HeroIcons';
import { useStyleStore } from '@/providers/styleProvider';

import type { FC } from 'react';

export interface DarkModeButtonProps {
  className?: string;
}

/**
 * 深色模式按钮
 */
const DarkModeButton: FC<DarkModeButtonProps> = (props) => {
  const { className } = props;
  const isDarkMode = useStyleStore((state) => state.isDarkMode);
  const setIsDarkMode = useStyleStore((state) => state.setIsDarkMode);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div
      onClick={toggleTheme}
      className={`${
        className || ''
      } flex h-10 w-10 items-center justify-center rounded-full text-gray-800 hover:bg-gray-200/40 dark:text-gray-200 dark:hover:bg-gray-800/40`}
    >
      <div id="darkModeButton" className=" h-5 w-5 transform cursor-pointer ">
        {isDarkMode ? <Sun /> : <Moon />}
      </div>
    </div>
  );
};

export default DarkModeButton;
