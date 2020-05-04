const Utils = require('gatsby-plugin-css');

exports.onCreateWebpackConfig = (
  { actions, plugins, loaders, stage, getConfig },
  pluginOptions = {},
) => {
  const config = getConfig();
  const { propsLayout, defaults = {} } = pluginOptions;

  const oldCssRules = Utils.findCssRules(config);

  const cssRule = Utils.createWebpackRule({
    api: { stage, loaders },
    test: /\.css$/,
    modulesTest: /\.module\.css$/,
    autoprefix: false,
    loader: {
      loader: require.resolve('./tools/theme-loader'),
      options: {
        pluginOptions,
      },
    },
  });

  oldCssRules.oneOf = cssRule.oneOf;

  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          include: [
            /packages\/theme\/src\/.*/,
            /.yalc\/@docpocalypse\/gatsby-theme.*\/src\/.*/,
            /node_modules\/@docpocalypse\/gatsby-theme.*\/src\/.*/,
          ],
          use: [
            {
              loader: 'astroturf/loader',
              options: {
                tagName: 'dcss',
                styledTag: 'dstyled',
                extension: '.module.css',
                enableCssProp: true,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      plugins.define({
        'process.env': {
          DOCPOC_PROPS_LAYOUT: JSON.stringify(
            defaults.propsLayout || propsLayout || 'table',
          ),
          DOCPOC_SHOW_CODE: JSON.stringify(defaults.showExampleCode || true),
          DOCPOC_SHOW_IMPORTS: JSON.stringify(
            defaults.showExampleImports || false,
          ),
        },
      }),
    ],
  });
};
