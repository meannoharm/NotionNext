import BLOG from 'blog.config';
import { useEffect, useState } from 'react';
import Select from './Select';
import { useGlobal } from '@/context/global';
import { THEMES } from '@/lib/theme';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

/**
 *
 * @returns 调试面板
 */
const DebugPanel = () => {
  const [show, setShow] = useState(false);
  const { theme, switchTheme } = useGlobal();
  const router = useRouter();
  const [siteConfig, updateSiteConfig] = useState({});
  const { t } = useTranslation('common');

  // 主题下拉框
  const themeOptions = THEMES?.map((t) => ({ value: t, text: t }));

  useEffect(() => {
    updateSiteConfig(Object.assign({}, BLOG));
    // updateThemeConfig(Object.assign({}, ThemeMap[BLOG.THEME].THEME_CONFIG))
  }, []);

  function toggleShow() {
    setShow(!show);
  }

  function handleChangeDebugTheme() {
    switchTheme();
  }

  function handleUpdateDebugTheme(newTheme) {
    const query = { ...router.query, theme: newTheme };
    router.push({ pathname: router.pathname, query });
  }

  function filterResult(text) {
    switch (text) {
      case 'true':
        return <span className="text-green-500">true</span>;
      case 'false':
        return <span className="text-red-500">false</span>;
      case '':
        return '-';
    }
    return text;
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
            <i className="fas fa-times">&nbsp;{t('debug-close')}</i>
          ) : (
            <i className="fas fa-tools">&nbsp;{t('debug-open')}</i>
          )}
        </div>
      </div>

      {/* 调试侧拉抽屉 */}
      <div
        className={` ${show ? 'shadow-card right-0 w-96 ' : 'invisible -right-96 w-0'} fixed bottom-0 z-50 h-full overflow-y-scroll bg-white p-5 duration-200`}
      >
        <div className="my-5 flex justify-between space-x-1">
          <div className="flex">
            <Select
              label={t('theme-switch')}
              value={theme}
              options={themeOptions}
              onChange={handleUpdateDebugTheme}
            />
            <div
              className="cursor-pointer p-2"
              onClick={handleChangeDebugTheme}
            >
              <i className="fas fa-sync" />
            </div>
          </div>

          <div className="p-2">
            <i className="fas fa-times" onClick={toggleShow} />
          </div>
        </div>

        <div>
          {/* <div>
                        <div className="font-bold w-18 border-b my-2">
                            主题配置{`config_${debugTheme}.js`}:
                        </div>
                        <div className="text-xs">
                            {Object.keys(themeConfig).map(k => (
                                <div key={k} className="justify-between flex py-1">
                                    <span className="bg-indigo-500 p-0.5 rounded text-white mr-2">
                                        {k}
                                    </span>
                                    <span className="whitespace-nowrap">
                                        {filterResult(themeConfig[k] + '')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div> */}
          <div className="w-18 my-2 border-b font-bold">
            站点配置[blog.config.js]
          </div>
          <div className="text-xs">
            {siteConfig &&
              Object.keys(siteConfig).map((k) => (
                <div key={k} className="flex justify-between py-1">
                  <span className="mr-2 rounded bg-blue-500 p-0.5 text-white">
                    {k}
                  </span>
                  <span className="whitespace-nowrap">
                    {filterResult(siteConfig[k] + '')}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default DebugPanel;
