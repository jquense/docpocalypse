const apis = require('./create-node');
const { Imports } = require('./example-scope-loader');

module.exports = apis;

module.exports.createPages = async ({ graphql, actions }, pluginOptions) => {
  const { templates } = pluginOptions;
  Imports.clear();

  const { data, errors } = await graphql(/* GraphQL */ `
    {
      allDocpocalypse {
        nodes {
          name
          type
          id
          example {
            codeBlockImports {
              type
              request
              context
            }
          }
        }
      }
    }
  `);

  if (errors) throw errors;

  for (const doc of data.allDocpocalypse.nodes) {
    if (doc.example) {
      Imports.set(doc.name, doc.example.codeBlockImports);
    }

    actions.createPage({
      path: `/api/${doc.name}`,
      component: templates[doc.type],
      context: {
        nodeId: doc.id
      }
    });
  }
};

module.exports.onCreateWebpackConfig = ({ stage, actions, plugins }) => {
  const isSsr = stage.includes('html');

  actions.setWebpackConfig({
    module: {
      rules: [
        {
          include: [require.resolve('./gatsby-browser')],
          use: {
            loader: require.resolve('./example-scope-loader')
          }
        }
      ]
    },
    plugins: [
      plugins.define({
        // Allow browser-only code to be eliminated
        'typeof window': isSsr
          ? JSON.stringify('undefined')
          : JSON.stringify('object')
      })
    ]
  });
};
