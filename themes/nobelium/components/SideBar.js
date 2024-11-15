import BLOG from 'blog.config';
import Live2D from '@/components/Live2D';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

const ExampleRecentComments = dynamic(() => import('./ExampleRecentComments'));

export const SideBar = (props) => {
  const { latestPosts, categories } = props;
  const { t } = useTranslation('common');

  return (
    <div className="sticky top-8 w-full md:w-64">
      <aside className="mb-6 overflow-hidden rounded shadow">
        <h3 className="border-b bg-gray-100 px-4 py-3 text-sm text-gray-700 dark:border-hexo-black-gray dark:bg-hexo-black-gray dark:text-gray-200">
          {t('category')}
        </h3>

        <div className="p-4">
          <ul className="list-reset leading-normal">
            {categories?.map((category) => {
              return (
                <Link
                  key={category.name}
                  href={`/category/${category.name}`}
                  passHref
                  legacyBehavior
                >
                  <li>
                    {' '}
                    <a href="#" className="text-gray-darkest text-sm">
                      {category.name}({category.count})
                    </a>
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
      </aside>

      <aside className="mb-6 overflow-hidden rounded shadow">
        <h3 className="border-b bg-gray-100 px-4 py-3 text-sm text-gray-700 dark:border-hexo-black-gray dark:bg-hexo-black-gray dark:text-gray-200">
          {t('latest-posts')}
        </h3>

        <div className="p-4">
          <ul className="list-reset leading-normal">
            {latestPosts?.map((p) => {
              return (
                <Link key={p.id} href={`/${p.slug}`} passHref legacyBehavior>
                  <li>
                    {' '}
                    <a href="#" className="text-gray-darkest text-sm">
                      {p.title}
                    </a>
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
      </aside>

      {BLOG.COMMENT_WALINE_SERVER_URL && BLOG.COMMENT_WALINE_RECENT && (
        <aside className="mb-6 overflow-hidden rounded shadow">
          <h3 className="border-b bg-gray-100 px-4 py-3 text-sm text-gray-700 dark:border-hexo-black-gray dark:bg-hexo-black-gray dark:text-gray-200">
            {t('recent-comments')}
          </h3>

          <div className="p-4">
            <ExampleRecentComments />
          </div>
        </aside>
      )}

      <aside className="mb-6  overflow-hidden rounded">
        <Live2D />
      </aside>
    </div>
  );
};
