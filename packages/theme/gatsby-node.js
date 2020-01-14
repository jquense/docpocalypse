exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          include: [
            /packages\/theme\/src\/.*/,
            /.yalc\/@docpocalypse\/gatsby-theme.*\/src\/.*/,
            /node_modules\/@docpocalypse\/gatsby-theme.*\/src\/.*/
          ],
          use: [
            {
              loader: 'astroturf/loader',
              options: {
                tagName: 'dcss',
                styledTag: 'dstyled',
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
