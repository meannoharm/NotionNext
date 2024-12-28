import { type ChangeEvent } from 'react';
import { Draggable } from 'components/Draggable';
import { THEMES } from '@/constants';
import { useStyleStore } from 'providers/styleProvider';
/**
 *
 * @returns 主题切换
 */
const ThemeSwitch = () => {
  const theme = useStyleStore((state) => state.theme);
  const setTheme = useStyleStore((state) => state.setTheme);

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
  };

  return (
    <Draggable>
      <div
        id="draggableBox"
        style={{ left: '10px', top: '80vh' }}
        className="fixed z-50 rounded-2xl bg-gray-50 drop-shadow-lg dark:bg-black dark:text-white"
      >
        <div className="group flex w-full items-center p-3 text-sm transition-all duration-200">
          <div className="w-0 overflow-hidden transition-all duration-200 group-hover:w-20">
            <select
              value={theme}
              onChange={onSelectChange}
              name="themes"
              className="cursor-pointer appearance-none bg-gray-50 uppercase outline-none dark:bg-black dark:text-white"
            >
              {THEMES?.map((t: string) => {
                return (
                  <option key={t} value={t}>
                    {t}
                  </option>
                );
              })}
            </select>
          </div>
          <i className="fa-solid fa-palette"></i>
        </div>
      </div>
    </Draggable>
  );
};

export default ThemeSwitch;
