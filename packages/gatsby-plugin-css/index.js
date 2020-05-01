const cuid = require('cuid');

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

const createWebpackRule = ({
  test,
  modulesTest,
  loader,
  cssModulesOptions,
  useCssModuleLoader,
  useDefaultPostcss = true,
  importLoaders = loader ? 2 : 1,
  postcssOptions,
  api,
}) => {
  const { stage, loaders } = api;

  const isSSR = stage.includes('html');
  const isDevelop = stage.includes('develop');

  let modulesOptions = cssModulesOptions == null ? true : cssModulesOptions;
  if (useCssModuleLoader) modulesOptions = false;

  const postcssLoader = (opts = {}) =>
    useDefaultPostcss
      ? loaders.postcss(opts)
      : {
          loader: require.resolve('postcss-loader'),
          options: {
            ident: cuid(),
            ...opts,
          },
        };

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

  return {
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
          postcssLoader(postcssOptions),
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
              postcssLoader(postcssOptions),
              loader,
            ].filter(Boolean),
      },
    ],
  };
};

module.exports = { findCssRules, createWebpackRule, isCssRules };
