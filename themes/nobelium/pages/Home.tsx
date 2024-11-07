import Announcement from '../components/Announcement';
import { OriginPostList } from './PostList';
import { ContextWrapper } from '../providers';

import type { HomeComponent } from '@/themes/types';

/**
 * 首页
 * 首页是个博客列表，加上顶部嵌入一个公告
 * @param {*} props
 * @returns
 */

const Home: HomeComponent = (props) => {
  return <OriginPostList {...props} topSlot={<Announcement {...props} />} />;
};

export default ContextWrapper(Home);
