import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSiteStore } from 'providers/siteProvider';

import type { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

export interface ArticleInfoProps {
  validPassword: (password: string) => boolean;
}

/**
 * 加密文章校验组件
 * @param {password, validPassword} props
 * @param password 正确的密码
 * @param validPassword(bool) 回调函数，校验正确回调入参为true
 * @returns
 */
const ArticleLock: FC = () => {
  const { validPassword, updateIsLock } = useSiteStore(
    useShallow((state) => ({
      validPassword: state.validPassword,
      updateIsLock: state.updateIsLock,
    })),
  );
  const { t } = useTranslation('common');
  const [password, setPassword] = useState('');
  const [isShowTip, setIsShowTip] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const submitPassword = useCallback(() => {
    if (!validPassword(password)) {
      setIsShowTip(true);
    } else {
      setIsShowTip(false);
      updateIsLock(false);
    }
  }, [password, validPassword, updateIsLock]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitPassword();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  useEffect(() => {
    // 选中密码输入框并将其聚焦
    passwordInputRef.current?.focus();
  }, []);

  return (
    <div
      id="container"
      className="flex h-96 w-full items-center justify-center font-sans"
    >
      <div className="space-y-3 text-center">
        <div>{t('article-lock-tips')}</div>
        <div className="flex">
          <input
            id="password"
            type="password"
            value={password}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            ref={passwordInputRef} // 绑定ref到passwordInputRef变量
            className="w-full rounded-l bg-gray-50 pl-5 text-sm font-light leading-10 text-black outline-none transition  dark:bg-gray-500"
          ></input>
          <div
            onClick={submitPassword}
            className="cursor-pointer items-center justify-center whitespace-nowrap rounded-r bg-gray-300 px-3 py-2 duration-300"
          >
            <span className="mr-2">
              <i
                className={
                  'fas fa-key cursor-pointer duration-200 dark:text-black'
                }
              ></i>
            </span>
            {t('submit')}
          </div>
        </div>
        {isShowTip && (
          <div className="animate__shakeX animate__animated text-red-500">
            {t('password-error')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleLock;
