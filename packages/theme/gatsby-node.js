const path = require('path');
const { promises: fs } = require('fs');
const { GraphQLBoolean } = require('gatsby/graphql');

const keyBy = require('lodash/keyBy');

const getName = p => path.basename(p, path.extname(p));

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
  const { template, isComponent } = pluginOptions;

  const { data, errors } = await graphql(/* GraphQL */ `
    {
      allFile(filter: { sourceInstanceName: { regex: "/^@docs::/" } }) {
        edges {
          node {
            id
            name
            sourceInstanceName
          }
        }
      }
    }
  `);
  if (errors) throw errors;

  const nodesByName = keyBy(data.allFile.edges.map(e => e.node), n => n.name);

  for (const component of components) {
    const name = getName(component);
    const node = nodesByName[name];

    actions.createPage({
      path: `/components/${name}`,
      component: template,
      context: {
        displayName: name,
        nodeId: node && node.id,
        mdxId: node && node.childMdx && node.childMdx.id,
      },
    });
  }
};

exports.onCreateWebpackConfig = async (
  { plugins, actions },
  pluginOptions,
) => {
  const { components, scope } = pluginOptions;
  const scopePath = path.resolve('.cache/component-docs-scope.js');

  await fs.writeFile(
    scopePath,
    `
var d = i => i.default || i;

module.exports = {
  ${components
    .map(c => [getName(c), c])
    .concat(Object.entries(scope))
    .map(([key, value]) => `${key}: d(require('${value}'))`)
    .join(',\n  ')}
}
    `.trim(),
  );

  actions.setWebpackConfig({
    plugins: [
      plugins.normalModuleReplacement(
        /found\/lib\/withRouter/,
        require.resolve('./__mocks__/withRouter'),
      ),
      plugins.provide({
        __SCOPE__: scopePath,
      }),
    ],
  });
};
