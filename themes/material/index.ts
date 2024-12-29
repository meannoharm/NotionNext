import dynamic from 'next/dynamic';

export const Home = () => dynamic(import('./pages/Home'));
export const Article = () => dynamic(import('./pages/Article'));
