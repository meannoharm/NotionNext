import { FacebookProvider, Page } from 'react-facebook';
import { FacebookIcon } from 'react-share';
import { useShallow } from 'zustand/shallow';
import { useConfigStore } from '@/store/config';

/**
 * facebook个人主页
 * @returns
 */
const FacebookPage = () => {
  const {FACEBOOK_APP_ID, FACEBOOK_PAGE, FACEBOOK_PAGE_TITLE} = useConfigStore(useShallow(state => ({
    FACEBOOK_APP_ID: state.FACEBOOK_APP_ID,
    FACEBOOK_PAGE: state.FACEBOOK_PAGE,
    FACEBOOK_PAGE_TITLE: state.FACEBOOK_PAGE_TITLE,
  })));
  if (!FACEBOOK_APP_ID || !FACEBOOK_PAGE) {
    return <></>;
  }
  return (
    <div className="justify-center rounded-xl border bg-white px-2 py-4 shadow-md hover:shadow-xl dark:border-black dark:bg-hexo-black-gray dark:text-gray-300 lg:duration-100">
      {FACEBOOK_PAGE && (
        <div className="flex items-center pb-2">
          <a
            href={FACEBOOK_PAGE}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 pr-2 pt-0"
          >
            <FacebookIcon size={28} round />
          </a>
          <a
            href={FACEBOOK_PAGE}
            rel="noopener noreferrer"
            target="_blank"
          >
            {FACEBOOK_PAGE_TITLE}
          </a>
        </div>
      )}
      {FACEBOOK_APP_ID && (
        <FacebookProvider appId={FACEBOOK_APP_ID}>
          <Page href={FACEBOOK_PAGE} tabs="timeline" />
        </FacebookProvider>
      )}
    </div>
  );
};
export default FacebookPage;
