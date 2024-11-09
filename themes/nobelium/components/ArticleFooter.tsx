import BLOG from '@/blog.config';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

/**
 * 加密文章校验组件
 * @param {password, validPassword} props
 * @param password 正确的密码
 * @param validPassword(bool) 回调函数，校验正确回调入参为true
 * @returns
 */
export const ArticleFooter = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <div className="flex justify-between font-medium text-gray-500 dark:text-gray-400">
      <a>
        <button
          onClick={() => router.push(BLOG.path || '/')}
          className="mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100"
        >
          <i className="fas fa-angle-left mr-1" />
          {t('back')}
        </button>
      </a>
      <a>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100"
        >
          <i className="fas fa-angle-up mr-1" />
          {t('top')}
        </button>
      </a>
    </div>
  );
};

export default ArticleFooter;
