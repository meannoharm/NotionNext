import { useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';

/**
 * 加密文章校验组件
 * @param {password, validPassword} props
 * @param password 正确的密码
 * @param validPassword(bool) 回调函数，校验正确回调入参为true
 * @returns
 */
const ArticleLock = (props) => {
  const { validPassword } = props;
  const { t } = useTranslation('common');

  const submitPassword = () => {
    const p = document.getElementById('password');
    if (!validPassword(p?.value)) {
      const tips = document.getElementById('tips');
      if (tips) {
        tips.innerHTML = '';
        tips.innerHTML = `<div class='text-red-500 animate__shakeX animate__animated'>${t('password-error')}</div>`;
      }
    }
  };

  const passwordInputRef = useRef(null);
  useEffect(() => {
    // 选中密码输入框并将其聚焦
    passwordInputRef.current.focus();
  }, []);

  return (
    <div
      id="container"
      className="flex h-96 w-full items-center justify-center font-sans"
    >
      <div className="space-y-3 text-center">
        <div className="font-bold">{t('article-lock-tips')}</div>
        <div className="flex">
          <input
            id="password"
            type="password"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                submitPassword();
              }
            }}
            ref={passwordInputRef} // 绑定ref到passwordInputRef变量
            className="w-full rounded-l bg-gray-50 pl-5 text-sm font-light leading-10 text-black outline-none transition focus:shadow-lg dark:bg-gray-500"
          ></input>
          <div
            onClick={submitPassword}
            className="cursor-pointer items-center justify-center whitespace-nowrap rounded-r bg-gray-300 px-3 py-2 duration-300"
          >
            <i
              className={
                'fas fa-key cursor-pointer duration-200 dark:text-black'
              }
            >
              &nbsp;{t('submit')}
            </i>
          </div>
        </div>
        <div id="tips"></div>
      </div>
    </div>
  );
};

export default ArticleLock;
