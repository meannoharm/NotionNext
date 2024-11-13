import Link from 'next/link';
import LayoutBase from '../layout/LayoutBase';
import { ContextWrapper } from '../providers';

import type { FC } from 'react';
import type { ThemeCategoryProps } from '@/pages/types';

/**
 * 文章分类列表
 * @param {*} props
 * @returns
 */
const Category: FC<ThemeCategoryProps> = (props) => {
  const { categoryOptions } = props;

  return (
    <LayoutBase {...props}>
      <div id="category-list" className="flex flex-wrap duration-200">
        {categoryOptions?.map((category) => {
          return (
            <Link
              key={category.name}
              href={`/category/${category.name}`}
              passHref
              legacyBehavior
            >
              <div
                className={
                  'cursor-pointer px-5 py-2 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                }
              >
                <i className="fas fa-folder mr-4" />
                {category.name}({category.count})
              </div>
            </Link>
          );
        })}
      </div>
    </LayoutBase>
  );
};

export default ContextWrapper(Category);
