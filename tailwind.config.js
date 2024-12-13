const { fontFamilies } = require('./scripts/font');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './themes/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'selector',
  theme: {
    fontFamily: fontFamilies,
  },
};
