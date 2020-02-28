const fs = require('fs');
const path = require('path');

const pkgDir = require('pkg-dir');

const apis = require('./dataModel');
const { Imports } = require('./example-scope-loader');

const hashPath = path.resolve('.cache/example-import-hash');

module.exports = apis;

function collectImports(name, node, context) {
  let docImports = Imports.get(name) || [];
  if (node.example)
    docImports = docImports.concat(node.example.codeBlockImports);

  // imports aren't likely to have a context since the're parent isn't a file
  context =
    context || (node.absolutePath ? path.dirname(node.absolutePath) : '');

  if (node.description && node.description.mdx) {
    docImports = docImports.concat(
      node.description.mdx.codeBlockImports.map(imports => ({
        ...imports,
        context,
      })),
    );
  }

  Imports.set(name, docImports);

  if (node.props && node.props.length) {
    node.props.forEach(n => collectImports(name, n, context));
  }
}

module.exports.createPages = async (
  { graphql, actions, createContentDigest },
  pluginOptions,
) => {
  const { templates } = pluginOptions;
  Imports.clear();

  const { data, errors } = await graphql(/* GraphQL */ `
    fragment imports on ComponentDescription {
      mdx {
        codeBlockImports {
          type
          request
          context
        }
      }
    }

    query {
      allDocpocalypse {
        nodes {
          name
          type
          id
          absolutePath
          description {
            ...imports
          }
          props {
            description {
              ...imports
            }
          }
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
    collectImports(doc.name, doc);

    actions.createPage({
      path: `/api/${doc.name}`,
      component: templates[doc.type],
      context: {
        nodeId: doc.id,
        // triggers query rerun
        exampleId: doc.example && doc.example.id,
      },
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

function getPackageAlias(pkgName) {
  return pkgDir(path.dirname(require.resolve(pkgName)));
}

module.exports.onCreateWebpackConfig = async (
  { actions, getConfig },
  pluginOptions,
) => {
  const { plugins } = getConfig();

  if (plugins) {
    const cssExtract = plugins.find(
      p => p.constructor && p.constructor.name === 'MiniCssExtractPlugin',
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
            options: pluginOptions,
          },
        },
      ],
    },
    resolve: {
      alias: {
        react: await getPackageAlias('react'),
        'react-dom': await getPackageAlias('react-dom'),
      },
    },
  });
  console.log(getConfig().resolve.alias);
};
