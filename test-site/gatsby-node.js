exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelOptions({
    options: {
      rootMode: 'upward'
    }
  });
};

// exports.onCreateWebpackConfig = ({ getConfig }) => {
//   // getConfig().module.rules.map(t => console.log(t));
//   // actions.setBabelOptions({
//   //   options: {
//   //     rootMode: 'upward'
//   //   }
//   // });
// };
