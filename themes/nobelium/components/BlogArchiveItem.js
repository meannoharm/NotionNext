import BLOG from 'blog.config';
import Link from 'next/link';

/**
 * 归档分组文章
 * @param {*} param0
 * @returns
 */
export default function BlogArchiveItem({ archiveTitle, archivePosts }) {
  return (
    <div key={archiveTitle}>
      <div id={archiveTitle} className="pb-4 pt-16 text-3xl dark:text-gray-300">
        {archiveTitle}
      </div>

      <ul>
        {archivePosts[archiveTitle].map((post) => (
          <li
            key={post.id}
            className="transform items-center border-l-2 p-1 text-xs  duration-500 hover:scale-x-105 hover:border-gray-500 dark:border-gray-400 dark:hover:border-gray-300 md:text-base"
          >
            <div id={post?.publishDay}>
              <span className="text-gray-400">{post.date?.start_date}</span>{' '}
              &nbsp;
              <Link
                href={`${BLOG.SUB_PATH}/${post.slug}`}
                passHref
                className="cursor-pointer  overflow-x-hidden text-gray-600 hover:underline dark:text-gray-400 dark:hover:text-gray-300"
              >
                {post.title}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
