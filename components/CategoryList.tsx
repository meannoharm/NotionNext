import { useSiteStore } from 'providers/siteProvider';
import Link from 'next/link';
import { useShallow } from 'zustand/react/shallow';

const CategoryList = () => {
  const { category: currentCategory, categoryOptions } = useSiteStore(
    useShallow((state) => ({
      category: state.category,
      categoryOptions: state.categoryOptions,
    })),
  );
  return (
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
              className={`cursor-pointer px-5 py-2 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white ${
                category.name === currentCategory
                  ? 'bg-gray-100 text-black dark:bg-gray-600 dark:text-white'
                  : ''
              }`}
            >
              <i className="fas fa-folder mr-4" />
              {category.name}({category.count})
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryList;
