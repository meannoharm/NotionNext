import { useSiteStore } from '@/providers/siteProvider';

const TableOfContent = () => {
  const post = useSiteStore((state) => state.post);

  if (!post || !post.toc) return null;

  return (
    <div className="sticky top-20 p-2">
      {post.toc.map((item) => (
        <a
          href={`#${item.id}`}
          className="mb-1 block cursor-pointer text-gray-700 transition-colors hover:text-blue-500"
          style={{
            paddingLeft: `${2 * item.indentLevel}rem`,
          }}
          key={item.id}
        >
          {item.text}
        </a>
      ))}
    </div>
  );
};

export default TableOfContent;
