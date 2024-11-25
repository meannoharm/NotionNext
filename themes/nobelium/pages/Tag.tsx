import LayoutBase from '../layout/LayoutBase';
import { ContextWrapper } from '../providers/index';
import TagItem from '../components/TagItem';

import type { FC } from 'react';
import type { ThemeTagProps } from '@/types';

/**
 * 文章标签列表
 * @param {*} props
 * @returns
 */
const Tag: FC<ThemeTagProps> = (props) => {
  const { tagOptions } = props;
  return (
    <LayoutBase {...props}>
      <div id="tags-list" className="flex flex-wrap duration-200">
        {tagOptions.map((tag) => {
          return (
            <TagItem
              key={tag.name}
              tag={tag.name}
              color={tag.color}
              count={tag.count}
              className="mb-2 mr-3"
            />
          );
        })}
      </div>
    </LayoutBase>
  );
};

export default ContextWrapper(Tag);
