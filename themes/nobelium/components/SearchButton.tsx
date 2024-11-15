// import BLOG from 'blog.config';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

/**
 * 搜索按钮
 * @returns
 */
export default function SearchButton() {
  // const { searchModal } = useNobeliumGlobal();
  const { t } = useTranslation('nav');
  const router = useRouter();

  function handleSearch() {
    // if (BLOG.ALGOLIA_APP_ID) {
    //   searchModal.current.openSearch();
    // } else {
    router.push('/search');
    // }
  }

  return (
    <div
      onClick={handleSearch}
      title={t('search')}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full  hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10"
    >
      <i title={t('search')} className="fa-solid fa-magnifying-glass" />
    </div>
  );
}
