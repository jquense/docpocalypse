const path = require('path');

module.exports = {
  plugins: [
    {
      resolve: 'docpocalypse',
      options: {
        sources: [path.resolve(__dirname, '../packages/code-live/src')],
        getImportName(docNode, fileNode) {
          return `import { ${docNode.name} } from '${docNode.packageName}'`;
        },
        reactDocgenConfig: {
          babelrcRoots: true
        }
      }
    }
  ]
};
