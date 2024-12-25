import dynamic from 'next/dynamic';

const Home = () => dynamic(import('./pages/Home'));

const Material = { Home };

export default Material;
