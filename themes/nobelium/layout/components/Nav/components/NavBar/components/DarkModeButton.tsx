import { useGlobal } from '@/context/global';
import { Moon, Sun } from '@/components/HeroIcons';
import { useImperativeHandle } from 'react';

import type { FC, RefObject } from 'react';

export interface DarkModeButtonProps {
  className?: string;
  cRef?: RefObject<{ handleChangeDarkMode: () => void }>;
}

/**
 * 深色模式按钮
 */
const DarkModeButton: FC<DarkModeButtonProps> = (props) => {
  const { cRef, className } = props;
  const { isDarkMode, setIsDarkMode } = useGlobal();

  /**
   * 对外暴露方法
   */
  useImperativeHandle(cRef, () => {
    return {
      handleChangeDarkMode: () => {
        handleChangeDarkMode();
      },
    };
  });

  // 用户手动设置主题
  const handleChangeDarkMode = () => {
    const newStatus = !isDarkMode;
    setIsDarkMode(newStatus);
  };

  return (
    <div
      onClick={handleChangeDarkMode}
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
