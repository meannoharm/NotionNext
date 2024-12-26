import { useSiteStore } from 'providers/siteProvider';
import TagItem from './TagItem';

const TagList = () => {
  const tagOptions = useSiteStore((state) => state.tagOptions);

  return (
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
  );
};

export default TagList;
