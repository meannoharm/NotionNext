import React from 'react';
import LayoutBase from '../layout/LayoutBase';
import BlogList from '../components/BlogList';

/**
 * 博客列表
 * @param {*} props
 * @returns
 */
const PostList = () => {
  return (
    <LayoutBase>
      <BlogList />
    </LayoutBase>
  );
};

export default PostList;
