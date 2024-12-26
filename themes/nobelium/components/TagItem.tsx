import Link from 'next/link';

const TagItem = ({
  tag,
  color = 'gray',
  count,
  className = '',
}: {
  tag: string;
  color?: string;
  count?: number;
  className?: string;
}) => {
  return (
    <div className={`${className}`}>
      <Link
        href={`/tag/${encodeURIComponent(tag)}`}
        passHref
        className={`inline-block cursor-pointer whitespace-nowrap rounded px-2 py-1 text-xs `}
        style={{
          backgroundColor: `var(--notion-item-${color})`,
          color: `var(--notion-item-text-${color})`,
        }}
      >
        <div className="font-light">
          <i className="fas fa-tag mr-1" />
          <span>{tag}</span>
          {count && <span className="ml-1">({count})</span>}
        </div>
      </Link>
    </div>
  );
};

export default TagItem;
