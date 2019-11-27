const remarkSlug = require('remark-slug');

module.exports = (options = {}) => {
  const {
    sources,
    templates,
    reactDocgenConfig,
    examplesPath = 'src/examples'
  } = options;

  const sourceFiles = sources.map(src => ({
    resolve: 'gatsby-source-filesystem',
    options: {
      path: src,
      name: `@docs::source//${src}`
    }
  }));

  return {
    plugins: [
      'gatsby-plugin-sorted-assets',
      'gatsby-plugin-typescript',
      examplesPath && {
        resolve: 'gatsby-source-filesystem',
        options: {
          path: examplesPath,
          name: '@docs::examples'
        }
      },
      ...sourceFiles,
      {
        resolve: 'gatsby-plugin-mdx',
        options: {
          defaultLayouts: {
            default: templates.default
          },
          remarkPlugins: [remarkSlug]
        }
      },
      {
        resolve: 'gatsby-transformer-remark',
        options: { plugins: ['gatsby-remark-prismjs'] }
      },
      'gatsby-transformer-documentationjs',
      {
        resolve: require.resolve('./plugins/react-docgen'),
        options: {
          resolver: require('./tools/resolver'),
          ...reactDocgenConfig
        }
      }
    ].filter(Boolean)
  };
};
