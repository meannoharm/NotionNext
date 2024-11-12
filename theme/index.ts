export * from './getLayout';
export * from './utils';
import getConfig from 'next/config';

// Scan all themes in next.config.js
export const { THEMES = [] } = getConfig().publicRuntimeConfig;
