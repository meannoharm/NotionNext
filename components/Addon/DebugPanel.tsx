import { useState } from 'react';
import Select from 'components/Select';
import { useTranslation } from 'next-i18next';
import { useStyleStore } from 'providers/styleProvider';
import { useConfigStore } from 'providers/configProvider';
import { random } from 'lodash';

/**
 *
 * @returns 调试面板
 */
const DebugPanel = () => {
  const [show, setShow] = useState(false);
  const theme = useStyleStore((state) => state.theme);
  const themeList = useStyleStore((state) => state.themeList);
  const setTheme = useStyleStore((state) => state.setTheme);
  const siteConfig = useConfigStore((state) => state);
  const { t } = useTranslation('common');

  function toggleShow() {
    setShow(!show);
  }

  function randomTheme() {
    const newTheme = themeList[random(0, themeList.length - 1)];
    setTheme(newTheme);
  }

  return (
    <>
      {/* 调试按钮 */}
      <div>
        <div
          style={{ writingMode: 'vertical-lr' }}
          className={`cursor-pointer rounded-l-xl bg-black p-1.5 text-xs text-white shadow-2xl ${show ? 'right-96' : 'right-0'} fixed bottom-72 z-50 duration-200`}
          onClick={toggleShow}
        >
          {show ? (
            <span>
              <i className="fas fa-times mb-1"></i>
              <span>{t('debug-close')}</span>
            </span>
          ) : (
            <span>
              <i className="fas fa-tools mb-1"></i>
              <span>{t('debug-open')}</span>
            </span>
          )}
        </div>
      </div>

      {/* 调试侧拉抽屉 */}
      <div
        className={`${show ? 'shadow-card right-0 w-96 ' : 'invisible -right-96 w-0'} fixed bottom-0 z-50 h-full overflow-y-scroll border-l bg-white p-5 shadow duration-200`}
      >
        <div className="mb-2 flex justify-between">
          <Select
            label={t('theme-switch')}
            value={theme}
            options={themeList}
            onChange={setTheme}
          />
          <div className="cursor-pointer p-2" onClick={randomTheme}>
            <i className="fas fa-sync" />
          </div>
          <div className="ml-auto cursor-pointer p-2" onClick={toggleShow}>
            <i className="fas fa-times" />
          </div>
        </div>

        <div>
          <div className="w-18 mb-2 border-b pb-2 font-bold">
            {t('site_config')}
          </div>
          <div className="">
            {siteConfig &&
              Object.entries(siteConfig).map(([key, value]) => (
                <div key={key} className="mb-2 flex flex-col">
                  <div className="mb-1">{key}</div>
                  <div className="overflow-hidden border">
                    {JSON.stringify(value)}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};
export default DebugPanel;
