const path = require('path');
const remarkSlug = require('remark-slug');
const finder = require('find-package-json');

function getPkgMeta(root) {
  for (const { value } of finder(root)) {
    if (value) return value;
  }

  return {};
}

module.exports = (options = {}) => {
  const {
    sources,
    isComponent,
    getImportForComponent,
    extensions = ['.js', '.ts', '.tsx'],
    examplesPath = 'src/examples',
  } = options;

  const sourceFiles = sources.map(src => ({
    resolve: 'gatsby-source-filesystem',
    options: {
      path: src,
      name: `@docs::${src}`,
    },
  }));

  return {
    plugins: [
      'gatsby-plugin-typescript',
      examplesPath && {
        resolve: 'gatsby-source-filesystem',
        options: {
          path: examplesPath,
          name: 'examples',
        },
      },
      ...sourceFiles,
      {
        resolve: 'gatsby-mdx',
        options: {
          defaultLayouts: {
            default: require.resolve(`./src/components/Layout.js`),
          },
          remarkPlugins: [remarkSlug],
        },
      },
      {
        resolve: 'gatsby-transformer-react-docgen',
        options: {
          babelrcRoots: [__dirname, '../libraries/*'],
          resolver: require('./tools/resolver'),
        },
      },
      {
        resolve: 'gatsby-plugin-page-creator',
        options: {
          path: path.join(__dirname, 'src/pages'),
        },
      },
    ].filter(Boolean),
  };
};
