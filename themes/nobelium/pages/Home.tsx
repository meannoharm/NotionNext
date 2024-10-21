import Announcement from '../components/Announcement';
import PostList from './PostList';

import type { FC } from 'react';
import type { ThemeProps } from '@/themes/types';
/**
 * 首页
 * 首页是个博客列表，加上顶部嵌入一个公告
 * @param {*} props
 * @returns
 */

export interface HomeProps extends ThemeProps {}

const Home: FC<HomeProps> = (props) => {
  return <PostList {...props} topSlot={<Announcement {...props} />} />;
};

export default Home;
