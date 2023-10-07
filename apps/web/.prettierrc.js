const baseConfig = require('../../.prettierrc.js');

/** @type {import('prettier').Options} */
module.exports = {
  ...baseConfig,
  plugins: ['prettier-plugin-tailwindcss'],
};
