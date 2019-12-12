module.exports = {
  siteMetadata: {
    title: '{{pkgName}} documentation',
    author: 'Jason Quense'
  },
  plugins: [
    {
      resolve: '@docpocalypse/gatsby-theme',
      options: {
        sources: ['{{src}}'],
        getImportName(docNode) {
          return `import { ${docNode.name} } from '${docNode.packageName}'`;
        }
      }
    }
  ]
};
