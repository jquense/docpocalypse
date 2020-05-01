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
  importLoaders = loader ? 2 : 1,
  postcssPlugins: plugins,
  postcssParser = 'scss',
  api,
}) => {
  const { stage, loaders } = api;

  const isSSR = stage.includes('html');
  const isDevelop = stage.includes('develop');

  const parser =
    postcssParser === 'scss' ? require.resolve('postcss-scss') : postcssParser;

  let modulesOptions = cssModulesOptions == null ? true : cssModulesOptions;
  if (useCssModuleLoader) modulesOptions = false;

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
          loaders.postcss({
            ident: cuid(),
            parser,
            plugins,
          }),
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
              loaders.postcss({
                ident: cuid(),
                parser,
                plugins,
              }),
              loader,
            ].filter(Boolean),
      },
    ],
  };
};

module.exports = { findCssRules, createWebpackRule, isCssRules };
