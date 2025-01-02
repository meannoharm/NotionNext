import { useSiteStore } from '@/providers/siteProvider';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

const TagList = ({ tagList }: { tagList?: string[] }) => {
  const tagOptions = useSiteStore((state) => state.tagOptions);
  const tagColor = useCallback(
    (tag: string) => {
      return tagOptions.find((t) => t.name === tag)?.color || 'gray';
    },
    [tagOptions],
  );
  const router = useRouter();

  const list = tagList || tagOptions.map((tag) => tag.name);
  const handleClick = (tag: string) => {
    router.push(`/tag/${tag}`);
  };
  return (
    <Stack direction="row" spacing={1}>
      {list.map((tag: string) => (
        <Chip
          key={tag}
          label={tag}
          style={{
            backgroundColor: `var(--notion-item-${tagColor(tag)})`,
            color: `var(--notion-item-text-${tagColor(tag)})`,
          }}
          onClick={() => handleClick(tag)}
        />
      ))}
    </Stack>
  );
};

export default TagList;
