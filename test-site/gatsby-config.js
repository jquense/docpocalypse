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
        },
        typedocConfig: {
          tsconfig: require.resolve('./tsconfig.json'),
          mode: 'modules'
        }
      }
    }
    // {
    //   resolve: 'gatsby-plugin-typedoc',
    //   options: {
    //     project: path.resolve(__dirname, '../packages/code-live')
    //   }
    // }
  ]
};
