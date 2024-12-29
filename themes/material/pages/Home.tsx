import Layout from '../layout/Layout';
import Announcement from '../components/Announcement';
import PostList from '../components/PostLists';

const Home = () => {
  return (
    <Layout>
      <Announcement />
      <PostList />
    </Layout>
  );
};

export default Home;
