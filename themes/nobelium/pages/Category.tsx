import LayoutBase from '../layout/LayoutBase';
import CategoryList from '@/components/CategoryList';

/**
 * 文章分类列表
 * @param {*} props
 * @returns
 */
const Category = () => {
  return (
    <LayoutBase>
      <CategoryList />
    </LayoutBase>
  );
};

export default Category;
