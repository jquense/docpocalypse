const templates = require('./src/templates');
const themingPlugin = require('./tools/theming-plugin');

module.exports = (options = {}) => {
  return {
    plugins: [
      'gatsby-plugin-typescript',
      {
        resolve: 'gatsby-plugin-css',
        options: {
          postcssPlugins: () => {
            return [themingPlugin(options), require('postcss-nested')];
          },
        },
      },
      {
        resolve: '@docpocalypse/gatsby-theme-core',
        options: {
          templates,
          ...options,
        },
      },
    ],
  };
};
