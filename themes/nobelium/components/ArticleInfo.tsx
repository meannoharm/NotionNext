import Image from 'next/image';
import TagItem from './TagItem';
import md5 from 'js-md5';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import Link from 'next/link';
import { useSiteStore } from 'providers/siteProvider';
import NotionIcon from '@/components/NotionIcon';
import { useConfigStore } from 'providers/configProvider';
import { useShallow } from 'zustand/react/shallow';

export const ArticleInfo = () => {
  const post = useSiteStore((state) => state.post);
  const { EMAIL, GITHUB_URL, AUTHOR } = useConfigStore(
    useShallow((state) => ({
      EMAIL: state.EMAIL,
      GITHUB_URL: state.GITHUB_URL,
      AUTHOR: state.AUTHOR,
    })),
  );
  const tagOptions = useSiteStore((state) => state.tagOptions);
  const emailHash = md5(EMAIL);
  const tagColor = useCallback(
    (tag: string) => {
      return tagOptions.find((t) => t.name === tag)?.color || 'gray';
    },
    [tagOptions],
  );

  return (
    <section className="mt-2 flex flex-col font-light">
      <div className="text-3xl font-bold text-black dark:text-white">
        {post?.pageIcon && <NotionIcon icon={post?.pageIcon} />}
        {post?.title}
      </div>

      {post?.type !== 'Page' && (
        <>
          <div className="mt-7 flex items-center text-gray-500 dark:text-gray-500">
            <Link
              href={GITHUB_URL || '#'}
              className="mr-1 h-6 w-6 overflow-hidden"
            >
              <Image
                className="h-6 w-6 rounded-full"
                alt={AUTHOR}
                width={24}
                height={24}
                src={`https://gravatar.com/avatar/${emailHash}`}
              />
            </Link>
            <div className="mr-4 md:block">{AUTHOR}</div>
            <div className="mr-4 md:ml-0">
              {dayjs(post?.date).format('YYYY-MM-DD')}
            </div>
          </div>
          <div className="mt-4">
            {post?.tags && (
              <div className="article-tags mr-2 flex max-w-full flex-nowrap overflow-x-auto">
                {post?.tags.map((tag) => (
                  <TagItem
                    className="mr-2"
                    key={tag}
                    tag={tag}
                    color={tagColor(tag)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default ArticleInfo;
