const cuid = require('cuid');
const { createAtoms } = require('webpack-atoms');

const CSS_PATTERN = /\.css$/;
const MODULE_CSS_PATTERN = /\.module\.css$/;

const isCssRules = rule =>
  rule.test &&
  (rule.test.toString() === CSS_PATTERN.toString() ||
    rule.test.toString() === MODULE_CSS_PATTERN.toString());

const findCssRules = config =>
  config.module.rules.find(
    rule => Array.isArray(rule.oneOf) && rule.oneOf.every(isCssRules),
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
  const { stage, loaders: gatsbyLoaders } = api;

  const isSSR = stage.includes('html');
  const isDevelop = stage.includes('develop');

  const { loaders } = createAtoms({
    env: isDevelop ? 'development' : 'production',
  });

  const parser =
    postcssParser === 'scss' ? require.resolve('postcss-scss') : postcssParser;

  let modulesOptions = cssModulesOptions == null ? true : cssModulesOptions;
  if (useCssModuleLoader) modulesOptions = false;
  return {
    oneOf: [
      {
        test: modulesTest,
        use: [
          !isSSR && gatsbyLoaders.miniCssExtract({ hmr: false }),
          loaders.css({
            modules: modulesOptions,
            importLoaders: useCssModuleLoader
              ? importLoaders + 1
              : importLoaders,
          }),
          useCssModuleLoader && {
            loader: require.resolve('css-module-loader'),
            options: {
              ...(cssModulesOptions || {}),
              onlyLocals: isSSR,
            },
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
          ? [gatsbyLoaders.null()]
          : [
              gatsbyLoaders.miniCssExtract(),
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
