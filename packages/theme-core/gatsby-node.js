const { GraphQLBoolean } = require('gatsby/graphql');

const { onCreateNode, sourceNodes } = require('./create-node');

exports.onCreateNode = onCreateNode;
exports.sourceNodes = sourceNodes;

exports.setFieldsOnGraphQLNodeType = ({ type }, pluginOptions) => {
  const { components } = pluginOptions;
  return type.name === 'File'
    ? {
        isStyleGuideComponent: {
          type: GraphQLBoolean,
          resolve: source => components.includes(source.absolutePath),
        },
      }
    : {};
};

exports.createPages = async ({ graphql, actions }, pluginOptions) => {
  const { templates } = pluginOptions;
  const { data, errors } = await graphql(/* GraphQL */ `
    {
      allDocpocalypse {
        nodes {
          name
          type
          id
        }
      }
    }
  `);

  if (errors) throw errors;

  for (const doc of data.allDocpocalypse.nodes) {
    console.log(doc);
    actions.createPage({
      path: `/api/${doc.name}`,
      component: templates[doc.type],
      context: {
        nodeId: doc.id,
      },
    });
  }
};

exports.onCreateWebpackConfig = ({ stage, actions, plugins }) => {
  const isSsr = stage.includes('html');

  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        // Allow browser-only code to be eliminated
        'typeof window': isSsr
          ? JSON.stringify('undefined')
          : JSON.stringify('object'),
      }),
    ],
  });
};

// exports.onCreateWebpackConfig = async (
//   { plugins, actions },
//   pluginOptions,
// ) => {
//   const { components, scope } = pluginOptions;
//   const scopePath = path.resolve('.cache/component-docs-scope.js');

//   await fs.writeFile(
//     scopePath,
//     `
// var d = i => i.default || i;

// module.exports = {
//   ${components
//     .map(c => [getName(c), c])
//     .concat(Object.entries(scope))
//     .map(([key, value]) => `${key}: d(require('${value}'))`)
//     .join(',\n  ')}
// }
//     `.trim(),
//   );

//   actions.setWebpackConfig({
//     plugins: [
//       plugins.normalModuleReplacement(
//         /found\/lib\/withRouter/,
//         require.resolve('./__mocks__/withRouter'),
//       ),
//       plugins.provide({
//         __SCOPE__: scopePath,
//       }),
//     ],
//   });
// };
