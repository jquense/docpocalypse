const templates = require('./src/templates');

module.exports = (options = {}) => {
  return {
    plugins: [
      'gatsby-plugin-typescript',
      {
        resolve: 'gatsby-plugin-css',
        options: {
          useDefaultPostcss: false,
          postcssOptions: {
            config: {
              ctx: options,
            },
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
