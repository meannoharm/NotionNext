import Announcement from '../components/Announcement';
import { OriginPostList } from './PostList';
import { ContextWrapper } from '../providers';

import type { FC } from 'react';

/**
 * 首页
 * 首页是个博客列表，加上顶部嵌入一个公告
 * @param {*} props
 * @returns
 */

const Home: FC = () => {
  return <OriginPostList topSlot={<Announcement />} />;
};

export default ContextWrapper(Home);
