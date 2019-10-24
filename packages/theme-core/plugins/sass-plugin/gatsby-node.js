const { createAtoms } = require('webpack-atoms');

exports.onCreateWebpackConfig = ({
  actions,
  stage,
  loaders: gatsbyLoaders,
}) => {
  const isSSR = stage.includes('html');
  const isDevelop = stage.includes('develop');

  const { loaders } = createAtoms({
    env: isDevelop ? 'development' : 'production',
  });

  actions.setWebpackConfig({
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.module\.s(a|c)ss$/,
              use: [
                !isSSR && gatsbyLoaders.miniCssExtract({ hmr: false }),
                loaders.css({
                  modules: true,
                  importLoaders: 2,
                  onlyLocals: isSSR,
                }),
                loaders.postcss(),
                loaders.sass({
                  implementation: require('sass'),
                }),
              ].filter(Boolean),
            },
            {
              test: /\.s(a|c)ss$/,
              use: isSSR
                ? [gatsbyLoaders.null()]
                : [
                    gatsbyLoaders.miniCssExtract(),
                    loaders.css({ importLoaders: 2 }),
                    loaders.postcss(),
                    loaders.sass({
                      implementation: require('sass'),
                    }),
                  ],
            },
          ],
        },
      ],
    },
  });
};
