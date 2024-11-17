import Link from 'next/link';
import type { TagInfo } from '@/lib/notion';
import type { FC } from 'react';

export interface TagsProps {
  tagOptions: TagInfo[];
  tag: string;
}

const Tags: FC<TagsProps> = ({ tagOptions, tag: currentTag }) => {
  if (!tagOptions) return null;
  return (
    <div className="tag-container">
      <ul className="mt-4 flex max-w-full overflow-x-auto">
        {tagOptions.map((tag) => {
          return (
            <li
              key={tag.id}
              className={`mr-3 whitespace-nowrap border font-medium dark:text-gray-300 ${
                tag.name === currentTag
                  ? 'border-black bg-black text-white dark:border-gray-600 dark:bg-gray-600'
                  : 'border-gray-100 bg-gray-100 text-gray-400 dark:border-gray-800 dark:bg-night'
              }`}
            >
              <Link
                key={tag.id}
                href={
                  tag.name === currentTag
                    ? '/search'
                    : `/tag/${encodeURIComponent(tag.name)}`
                }
                className="block px-4 py-2"
              >
                {`${tag.name} (${tag.count})`}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Tags;
