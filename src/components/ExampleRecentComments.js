import React from 'react';
import BLOG from 'blog.config';
import Link from 'next/link';
import { RecentComments } from '@waline/client';

/**
 * @see https://waline.js.org/guide/get-started.html
 * @param {*} props
 * @returns
 */
const ExampleRecentComments = () => {
  const [comments, updateComments] = React.useState([]);
  const [onLoading, changeLoading] = React.useState(true);
  React.useEffect(() => {
    RecentComments({
      serverURL: BLOG.COMMENT_WALINE_SERVER_URL,
      count: 5,
    }).then(({ comments }) => {
      changeLoading(false);
      updateComments(comments);
    });
  }, []);

  return (
    <>
      {onLoading && (
        <div>
          Loading...
          <i className="fas fa-spinner ml-2 animate-spin" />
        </div>
      )}
      {!onLoading && comments && comments.length === 0 && (
        <div>No Comments</div>
      )}
      {!onLoading &&
        comments &&
        comments.length > 0 &&
        comments.map((comment) => (
          <div key={comment.objectId} className="pb-2">
            <div
              className="waline-recent-content wl-content text-xs text-gray-600 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: comment.comment }}
            />
            <div className="cursor-pointer pt-1 text-right font-sans text-sm text-gray-400 hover:text-red-500 hover:underline dark:text-gray-400">
              <Link
                href={{
                  pathname: comment.url,
                  hash: comment.objectId,
                  query: { target: 'comment' },
                }}
              >
                --{comment.nick}
              </Link>
            </div>
          </div>
        ))}
    </>
  );
};

export default ExampleRecentComments;
