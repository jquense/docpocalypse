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
        '@docpocalypse/code-live': path.resolve(
          __dirname,
          '../packages/code-live/src',
        ),
        '@docpocalypse/prism-react-renderer': path.resolve(
          __dirname,
          '../packages/prism-react-renderer/src',
        ),
      },
    },
  });
};
