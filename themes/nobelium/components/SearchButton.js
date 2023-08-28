import BLOG from '@/blog.config';
import { useGlobal } from '@/lib/global';
import { useRouter } from 'next/router';
import { useNobeliumGlobal } from '..';

/**
 * 搜索按钮
 * @returns
 */
export default function SearchButton(props) {
  const { locale } = useGlobal();
  const { searchModal } = useNobeliumGlobal();
  const router = useRouter();

  function handleSearch() {
    if (BLOG.ALGOLIA_APP_ID) {
      searchModal.current.openSearch();
    } else {
      router.push('/search');
    }
  }

  return (
    <>
      <div
        onClick={handleSearch}
        title={locale.NAV.SEARCH}
        alt={locale.NAV.SEARCH}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full  hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10"
      >
        <i title={locale.NAV.SEARCH} className="fa-solid fa-magnifying-glass" />
      </div>
    </>
  );
}
