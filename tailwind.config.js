const BLOG = require('./blog.config');
const { fontFamilies } = require('./scripts/font');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './themes/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'selector',
  theme: {
    fontFamily: fontFamilies,
    extend: {
      colors: {
        day: {
          DEFAULT: BLOG.BACKGROUND_LIGHT || '#ffffff',
        },
        night: {
          DEFAULT: BLOG.BACKGROUND_DARK || '#111827',
        },
        hexo: {
          'background-gray': '#f5f5f5',
          'black-gray': '#101414',
          'light-gray': '#e5e5e5',
        },
      },
      maxWidth: {
        side: '14rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
