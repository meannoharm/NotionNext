import Announcement from '../components/Announcement';

import type { FC } from 'react';
import PostList from './PostList';
/**
 * 首页
 * 首页是个博客列表，加上顶部嵌入一个公告
 * @param {*} props
 * @returns
 */

export interface IndexProps {
  children: React.ReactNode;
}

const Index: FC<IndexProps> = (props) => {
  return <PostList {...props} topSlot={<Announcement {...props} />} />;
};

export default Index;
