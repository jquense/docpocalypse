// const path = require('path');
const remarkSlug = require('remark-slug');
// const finder = require('find-package-json');

// function getPkgMeta(root) {
//   for (const { value } of finder(root)) {
//     if (value) return value;
//   }

//   return {};
// }

module.exports = (options = {}) => {
  const {
    sources,
    templates,
    reactDocgenConfig,
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
      require.resolve('./plugins/sass-plugin'),
      'gatsby-plugin-typescript',
      {
        resolve: 'gatsby-plugin-astroturf',
        options: { extension: '.module.scss', enableCssProp: true },
      },
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
          gatsbyRemarkPlugins: [
            {
              resolve: 'gatsby-remark-prismjs',
            },
          ],
        },
      },
      {
        resolve: 'gatsby-transformer-remark',
        options: { plugins: ['gatsby-remark-prismjs'] },
      },
      'gatsby-transformer-documentationjs',
      {
        resolve: 'gatsby-transformer-react-docgen',
        options: {
          resolver: require('./tools/resolver'),
          ...reactDocgenConfig,
        },
      },
    ].filter(Boolean),
  };
};
