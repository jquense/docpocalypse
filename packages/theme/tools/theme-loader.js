const Utils = require('gatsby-plugin-css');
const postcssLoader = require('gatsby-plugin-css/postcss-loader');

const themingPlugin = require('./theming-plugin');

const themeLoader = postcssLoader.custom(() => ({
  customOptions: ({ pluginOptions, ...loader }) => ({
    custom: pluginOptions,
    loader,
  }),
  config: (config, { customOptions }) => {
    return {
      ...config,
      plugins: [
        themingPlugin(customOptions),
        ...config.plugins,
        require('autoprefixer')({
          overrideBrowserslist: Utils.getSupportedBrowsers(),
          flexbox: `no-2009`,
        }),
      ],
    };
  },
}));

module.exports = themeLoader;
