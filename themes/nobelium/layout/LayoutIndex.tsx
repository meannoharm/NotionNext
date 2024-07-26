import Announcement from '../components/Announcement';

import type { FC } from 'react';
import LayoutPostList from './LayoutPostList';
/**
 * 首页
 * 首页是个博客列表，加上顶部嵌入一个公告
 * @param {*} props
 * @returns
 */

export interface LayoutIndexProps {
  children: React.ReactNode;
}

const LayoutIndex: FC<LayoutIndexProps> = (props) => {
  return <LayoutPostList {...props} topSlot={<Announcement {...props} />} />;
};

export default LayoutIndex;
