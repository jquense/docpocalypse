const Utils = require('./index');

exports.onCreateWebpackConfig = (api, { replaceExisting = true, ...rest }) => {
  const { actions, getConfig } = api;
  const config = getConfig();

  const oldCssRules = Utils.findCssRules(config);

  const cssRule = Utils.createWebpackRule({
    api,
    test: /\.css$/,
    modulesTest: /\.module\.css$/,
    postcss: true,
    ...rest,
  });

  if (replaceExisting && oldCssRules) {
    oldCssRules.oneOf = cssRule.oneOf;
    actions.replaceWebpackConfig(config);
  } else {
    actions.setWebpackConfig({ module: { rules: [cssRule] } });
  }
};
