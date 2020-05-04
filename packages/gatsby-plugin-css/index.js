const cuid = require('cuid');
const { store } = require('gatsby/dist/redux');
const { getBrowsersList } = require('gatsby/dist/utils/browserslist');

const CSS_PATTERN = /\.css$/;
const MODULE_CSS_PATTERN = /\.module\.css$/;

const isCssRules = (rule) =>
  rule.test &&
  (rule.test.toString() === CSS_PATTERN.toString() ||
    rule.test.toString() === MODULE_CSS_PATTERN.toString());

const findCssRules = (config) =>
  config.module.rules.find(
    (rule) => Array.isArray(rule.oneOf) && rule.oneOf.every(isCssRules),
  );

const getSupportedBrowsers = () => {
  return getBrowsersList(store.getState().program.directory);
};

const createWebpackRule = ({
  test,
  modulesTest,
  loader,
  cssModulesOptions,
  useCssModuleLoader,
  postcss = 'autoprefix',
  postcssLoaderOptions = {},
  importLoaders = 0,
  api,
}) => {
  const { stage, loaders } = api;

  const isSSR = stage.includes('html');
  const isDevelop = stage.includes('develop');

  let modulesOptions = cssModulesOptions == null ? true : cssModulesOptions;
  if (useCssModuleLoader) modulesOptions = false;

  const postcssLoader = () =>
    postcss && {
      loader: require.resolve('./utility-postcss-loader'),
      options: {
        ident: cuid(),
        // disallow configs when just autoprefixing
        config: postcss === true,
        ...postcssLoaderOptions,
        autoprefix: !!postcss,
      },
    };

  if (postcss) importLoaders += 1;
  if (loader) importLoaders += 1;

  const cssLoader = (opts = {}) => ({
    loader: require.resolve('css-loader'),
    options: {
      sourceMap: isDevelop,
      localsConvention: 'dashes',
      ...opts,
      onlyLocals: isSSR,
      modules: opts.modules
        ? {
            // https://github.com/webpack-contrib/css-loader/issues/406
            localIdentName: '[name]--[local]--[hash:base64:5]',
            ...opts.modules,
          }
        : false,
    },
  });

  const rule = {
    oneOf: [
      {
        test: modulesTest,
        use: [
          !isSSR && loaders.miniCssExtract({ hmr: false }),
          cssLoader({
            modules: modulesOptions,
            importLoaders: useCssModuleLoader
              ? importLoaders + 1
              : importLoaders,
          }),
          useCssModuleLoader && {
            loader: require.resolve('css-module-loader'),
            options: cssModulesOptions,
          },
          postcssLoader(),
          loader,
        ].filter(Boolean),
      },
      {
        test,
        use: isSSR
          ? [loaders.null()]
          : [
              loaders.miniCssExtract(),
              loaders.css({ importLoaders }),
              postcssLoader(),
              loader,
            ].filter(Boolean),
      },
    ],
  };

  return rule;
};

module.exports = {
  findCssRules,
  createWebpackRule,
  isCssRules,
  getSupportedBrowsers,
};
