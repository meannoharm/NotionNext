import Link from 'next/link';
import LayoutBase from '../layout/LayoutBase';
import { ContextWrapper } from '../providers/index';

import type { FC } from 'react';
import type { ThemeTagProps } from '@/pages/types';

/**
 * 文章标签列表
 * @param {*} props
 * @returns
 */
const Tag: FC<ThemeTagProps> = (props) => {
  const { tagOptions } = props;
  return (
    <LayoutBase {...props}>
      <div>
        <div id="tags-list" className="flex flex-wrap duration-200">
          {tagOptions.map((tag) => {
            return (
              <div key={tag.name} className="p-2">
                <Link
                  key={tag.id}
                  href={`/tag/${encodeURIComponent(tag.name)}`}
                  passHref
                  className={`mr-2 inline-block cursor-pointer whitespace-nowrap rounded px-2 py-1 text-xs text-gray-600 duration-200 hover:bg-gray-500 hover:text-white hover:shadow-xl dark:border-gray-400 dark:hover:text-white notion-${tag.color}_background dark:bg-gray-800`}
                >
                  <div className="font-light dark:text-gray-400">
                    <i className="fas fa-tag mr-1" />{' '}
                    {tag.name + (tag.count ? `(${tag.count})` : '')}{' '}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </LayoutBase>
  );
};

export default ContextWrapper(Tag);
