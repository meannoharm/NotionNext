import BLOG from '@/blog.config';
// import DarkModeButton from '@/components/DarkModeButton'
import Vercel from '@/components/Vercel';

export const Footer = (props) => {
  const d = new Date();
  const currentYear = d.getFullYear();
  const { post } = props;
  const fullWidth = post?.fullWidth ?? false;

  const copyrightDate = (function () {
    if (Number.isInteger(BLOG.SINCE) && BLOG.SINCE < currentYear) {
      return BLOG.SINCE + '-' + currentYear;
    }
    return currentYear;
  })();

  return (
    <footer
      className={`relative z-10 m-auto mt-6 w-full flex-shrink-0 text-gray-500 transition-all dark:text-gray-400 ${
        !fullWidth ? 'max-w-2xl px-4' : 'px-4 md:px-24'
      }`}
    >
      {/* <DarkModeButton className="text-center py-4" /> */}
      <hr className="border-gray-200 dark:border-gray-600" />
      <div className="my-4 text-sm leading-6">
        <div className="flex flex-col items-center md:flex-row">
          <div className="mr-0 md:mr-2">
            © {BLOG.AUTHOR} {copyrightDate}.
          </div>
          <div className="mb-2 mr-0 md:mr-auto">
            Licensed under <a href={BLOG.LICENSE_URL}>{BLOG.LICENSE}</a>.
          </div>
          <Vercel />
        </div>
      </div>
    </footer>
  );
};
