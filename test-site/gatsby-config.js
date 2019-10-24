const path = require('path');

module.exports = {
  plugins: [
    {
      resolve: 'docpocalypse',
      options: {
        sources: [path.resolve(__dirname, '../packages/editable-example/src')],
        reactDocgenConfig: {
          babelrcRoots: true,
        },
      },
    },
  ],
};
