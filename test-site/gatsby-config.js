const path = require('path');

module.exports = {
  __experimentalThemes: [
    {
      resolve: 'theme',
      options: {
        sources: [path.resolve(__dirname, '../packages/editable-example/src')],
      },
    },
  ],
};
