const templates = require('./src/templates');
const tailwindPlugin = require('./tools/tailwind-plugin');

module.exports = (options = {}) => {
  return {
    plugins: [
      'gatsby-plugin-typescript',
      {
        resolve: require.resolve('./plugins/css-plugin'),
        options: {
          postcssPlugins: () => {
            return [
              tailwindPlugin(options.tailwindConfig),
              require('postcss-nested')
            ];
          }
        }
      },
      {
        resolve: '@docpocalypse/gatsby-theme-core',
        options: {
          templates,
          ...options
        }
      }
    ]
  };
};
