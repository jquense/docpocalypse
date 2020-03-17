const path = require('path');

module.exports = {
  siteMetadata: {
    title: 'Docpocalypse',
    description: '',
  },
  plugins: [
    {
      resolve: `gatsby-plugin-webfonts`,
      options: {
        fonts: {
          google: [
            {
              family: 'Marcellus',
              subsets: ['latin'],
              display: 'swap',
            },
            {
              family: 'Cutive+Mono',
              subsets: ['latin'],
              display: 'swap',
            },
          ],
        },
      },
    },
    {
      resolve: '@docpocalypse/gatsby-theme',
      options: {
        sources: [
          path.resolve(__dirname, '../packages/theme/src/components'),
          path.resolve(__dirname, '../packages/code-live/src'),
        ],
        getImportName(docNode, _) {
          return `import { ${docNode.name} } from '${docNode.packageName}'`;
        },
        reactDocgenConfig: {
          babelrcRoots: true,
        },
        propsLayout: 'list',
        theming: 'minimal',
        tailwindConfig: require.resolve('./src/tailwind.config'),
        typedocConfig: {
          tsconfig: require.resolve('./tsconfig.json'),
          mode: 'modules',
        },
      },
    },
    {
      resolve: 'gatsby-plugin-astroturf',
      options: { enableCssProp: true },
    },
    {
      resolve: 'gatsby-plugin-typedoc',
      options: {
        debugRaw: true,
        projects: [path.resolve(__dirname, '../packages/code-live')],
      },
    },
  ],
};
