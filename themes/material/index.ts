import dynamic from 'next/dynamic';

export const Home = () => dynamic(import('./pages/Home'));
