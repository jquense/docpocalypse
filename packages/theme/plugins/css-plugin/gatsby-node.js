const { createAtoms } = require('webpack-atoms');

const CSS_PATTERN = /\.css$/;
const MODULE_CSS_PATTERN = /\.module\.css$/;

const isCssRules = rule =>
  rule.test &&
  (rule.test.toString() === CSS_PATTERN.toString() ||
    rule.test.toString() === MODULE_CSS_PATTERN.toString());

const findCssRules = config =>
  config.module.rules.find(
    rule => Array.isArray(rule.oneOf) && rule.oneOf.every(isCssRules)
  );

exports.onCreateWebpackConfig = (
  { actions, stage, getConfig, loaders: gatsbyLoaders },
  { postcssPlugins }
) => {
  const isSSR = stage.includes('html');
  const isDevelop = stage.includes('develop');
  const config = getConfig();
  const oldCssRules = findCssRules(config);

  const { loaders } = createAtoms({
    env: isDevelop ? 'development' : 'production'
  });

  const cssRule = {
    oneOf: [
      {
        test: /\.module\.css$/,
        use: [
          !isSSR && gatsbyLoaders.miniCssExtract({ hmr: false }),
          loaders.css({
            modules: true,
            importLoaders: 1,
            onlyLocals: isSSR
          }),
          loaders.postcss({
            parser: require.resolve('postcss-scss'),
            plugins: postcssPlugins
          })
        ].filter(Boolean)
      },
      {
        test: /\.css$/,
        use: isSSR
          ? [gatsbyLoaders.null()]
          : [
              gatsbyLoaders.miniCssExtract(),
              loaders.css({ importLoaders: 1 }),
              loaders.postcss({
                parser: require.resolve('postcss-scss'),
                plugins: postcssPlugins
              })
            ]
      }
    ]
  };

  if (oldCssRules) {
    oldCssRules.oneOf = cssRule.oneOf;
    actions.replaceWebpackConfig(config);
  } else {
    actions.setWebpackConfig({ module: { rules: [cssRule] } });
  }
};
