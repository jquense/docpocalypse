const Utils = require('.');
const postcssLoader = require('./postcss-loader');

const themeLoader = postcssLoader.custom(() => ({
  customOptions: ({ autoprefix, ...loader }) => {
    if (typeof autoprefix === 'boolean') autoprefix = autoprefix ? {} : false;

    return {
      custom: { autoprefix },
      loader,
    };
  },
  config: (config, { customOptions: { autoprefix } }) => {
    if (!autoprefix) return config;

    return {
      ...config,
      plugins: [
        ...config.plugins,
        autoprefix &&
          require('autoprefixer')({
            overrideBrowserslist: Utils.getSupportedBrowsers(),
            flexbox: `no-2009`,
            ...autoprefix,
          }),
      ].filter(Boolean),
    };
  },
}));

module.exports = themeLoader;
