import Announcement from '../components/Announcement';
import BlogList from '../components/BlogList';
import LayoutBase from '../layout/LayoutBase';

import type { FC } from 'react';

/**
 * 首页
 * 首页是个博客列表，加上顶部嵌入一个公告
 * @param {*} props
 * @returns
 */

const Home: FC = () => {
  return (
    <LayoutBase>
      <Announcement />
      <BlogList />
    </LayoutBase>
  );
};

export default Home;
