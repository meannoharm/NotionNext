import BLOG from 'blog.config';

/**
 * 标题栏
 * @param {*} props
 * @returns
 */
export const Title = (props) => {
  const { siteInfo, post } = props;
  const title = post?.title || siteInfo?.description;
  const description = post?.description || BLOG.AUTHOR;

  return (
    <div className="mb-6 border-b bg-gray-100 px-6 py-12 text-center dark:border-hexo-black-gray dark:bg-hexo-black-gray">
      <h1 className=" pb-4 text-xl md:text-4xl">{title}</h1>
      <p className="text-gray-dark leading-loose">{description}</p>
    </div>
  );
};
