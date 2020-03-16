const path = require('path');

module.exports = {
  siteMetadata: {
    title: 'Test Hooks',
    description: '',
  },
  plugins: [
    {
      resolve: '@docpocalypse/gatsby-theme',
      options: {
        sources: [path.resolve(__dirname, './src/hooks')],
        getImportName(docNode, _) {
          return `import { ${docNode.name} } from '${docNode.packageName}'`;
        },
        reactDocgenConfig: {
          babelrcRoots: true,
        },
        propsLayout: 'list',
      },
    },

    {
      resolve: 'gatsby-plugin-typedoc',
      options: {
        debugRaw: true,
        projects: [path.resolve(__dirname, './src/hooks')],
      },
    },
  ],
};
