import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useSiteStore } from 'providers/siteProvider';

/**
 * 随机跳转到一个文章
 */
export default function RandomPostButton() {
  const router = useRouter();
  const { t } = useTranslation('menu');
  const latestPosts = useSiteStore((state) => state.latestPosts);

  /**
   * 随机跳转文章
   */
  function handleClick() {
    const randomIndex = Math.floor(Math.random() * latestPosts.length);
    const randomPost = latestPosts[randomIndex];
    router.push(`/${randomPost?.slug}`);
  }

  return (
    <div
      title={t('walk-around')}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-800 hover:bg-gray-200/40 dark:text-gray-200 dark:hover:bg-gray-800/40"
      onClick={handleClick}
    >
      <i className="fa-solid fa-podcast"></i>
    </div>
  );
}
