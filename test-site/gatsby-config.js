const path = require('path');

module.exports = {
  plugins: [
    {
      resolve: '@docpocalypse/gatsby-theme',
      options: {
        sources: [path.resolve(__dirname, '../packages/code-live/src')],
        getImportName(docNode, _) {
          return `import { ${docNode.name} } from '${docNode.packageName}'`;
        },
        reactDocgenConfig: {
          babelrcRoots: true
        }
      }
    }
  ]
};
