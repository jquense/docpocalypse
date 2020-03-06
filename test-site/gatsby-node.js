const path = require('path');

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelOptions({
    options: {
      rootMode: 'upward',
    },
  });
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@docpocalypse/prism-react-renderer': path.resolve(
          __dirname,
          '../packages/prism-react-renderer/src',
        ),
      },
    },
  });
};
