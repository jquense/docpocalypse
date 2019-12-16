const fs = require('fs');
const path = require('path');

const apis = require('./create-node');
const { Imports } = require('./example-scope-loader');

const hashPath = path.resolve('.cache/example-import-hash');

module.exports = apis;

module.exports.createPages = async (
  { graphql, actions, createContentDigest },
  pluginOptions
) => {
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
            id
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
        nodeId: doc.id,
        // triggers query rerun
        exampleId: doc.example && doc.example.id
      }
    });
  }

  // We hash the imports and output a file so that the loader has something to
  // check for a "dirty" state
  const hash = createContentDigest(JSON.stringify(Array.from(Imports))).trim();

  const last = fs.existsSync(hashPath)
    ? fs.readFileSync(hashPath, 'utf-8').trim()
    : '';

  if (last !== hash) {
    fs.writeFileSync(hashPath, hash);
  }
};

module.exports.onCreateWebpackConfig = (
  { actions, getConfig },
  pluginOptions
) => {
  const { plugins } = getConfig();

  if (plugins) {
    const cssExtract = plugins.find(
      p => p.constructor && p.constructor.name === 'MiniCssExtractPlugin'
    );

    if (cssExtract) cssExtract.options.ignoreeOrder = true;
  }

  actions.setWebpackConfig({
    module: {
      rules: [
        {
          include: [require.resolve('./wrap-page')],
          use: {
            loader: require.resolve('./example-scope-loader'),
            options: pluginOptions
          }
        }
      ]
    }
  });
};
