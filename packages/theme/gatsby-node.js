exports.onCreateWebpackConfig = (
  { actions, plugins },
  { propsLayout, defaults = {} } = {},
) => {
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
