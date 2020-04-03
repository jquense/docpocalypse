const { handler, resolver } = require('react-docgen-styled-resolver');
const remarkSlug = require('remark-slug');

module.exports = (options = {}) => {
  const {
    sources,
    templates,
    reactDocgenConfig = {},
    // typedocConfig,
    examplesPath = 'src/examples',
  } = options;

  const sourceFiles = sources.map(src => ({
    resolve: 'gatsby-source-filesystem',
    options: {
      path: src,
      name: `@docs::source//${src}`,
    },
  }));

  return {
    plugins: [
      'gatsby-plugin-sorted-assets',
      examplesPath && {
        resolve: 'gatsby-source-filesystem',
        options: {
          path: examplesPath,
          name: '@docs::examples',
        },
      },
      ...sourceFiles,
      {
        resolve: 'gatsby-plugin-mdx',
        options: {
          defaultLayouts: {
            default: templates.default,
          },
          remarkPlugins: [remarkSlug],
        },
      },
      'gatsby-transformer-remark',
      {
        resolve: require.resolve('gatsby-transformer-documentationjs'),
      },
      {
        resolve: require.resolve('./plugins/react-docgen'),
        options: {
          resolver,
          ...reactDocgenConfig,
          handlers: [handler, ...(reactDocgenConfig.handlers || [])],
        },
      },
      // {
      //   resolve: 'gatsby-plugin-typedoc',
      //   options: {
      //     projects: sources
      //   }
      // }
    ].filter(Boolean),
  };
};
