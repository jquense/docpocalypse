exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          include: [
            /packages\/theme\/src\/.*/,
            /node_modules\/docpocalypse\/src\/.*/
          ],
          use: [
            {
              loader: 'astroturf/loader',
              options: {
                extension: '.module.css',
                enableCssProp: true
              }
            }
          ]
        }
      ]
    }
  });
};
