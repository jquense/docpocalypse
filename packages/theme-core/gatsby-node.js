const fs = require('fs');
const path = require('path');

const pkgDir = require('pkg-dir');
const { slash, createContentDigest } = require('gatsby-core-utils');
const debounce = require('lodash/debounce');
const chokidar = require('chokidar');

const apis = require('./dataModel');
const { Imports, PageImports } = require('./example-scope-loader');
const parseCodeBlocks = require('./parse-code-blocks');

const hashPath = path.resolve('.cache/example-import-hash');

const writeImportHash = debounce(() => {
  // We hash the imports and output a file so that the loader has something to
  // check for a "dirty" state
  const hash = createContentDigest(JSON.stringify(Array.from(Imports))).trim();

  const last = fs.existsSync(hashPath)
    ? fs.readFileSync(hashPath, 'utf-8').trim()
    : '';

  if (last !== hash) {
    // console.log('WRITING OUT');
    fs.writeFileSync(hashPath, hash);
  }
}, 300);

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

module.exports.createPages = async ({ graphql, actions }, pluginOptions) => {
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

  writeImportHash();
};

function getPackageAlias(pkgName) {
  return pkgDir(path.dirname(require.resolve(pkgName)));
}

function getPageImportKey(page) {
  return page.path === '/' ? '/' : page.path.replace(/\/$/, '');
}

async function parsePageImports(page) {
  const ext = path.extname(page.component);

  if (ext === '.mdx') {
    // console.log('Parsing page imports!');
    const codeBlockImports = await parseCodeBlocks.fromFile(
      page.componentPath,
      {
        ignore: (lang, meta) => !meta.live,
      },
    );

    PageImports.set(getPageImportKey(page), codeBlockImports);

    writeImportHash();
  }
}

module.exports.createPagesStatefully = ({ store }) => {
  const { program } = store.getState();
  const pageDir = slash(path.join(program.directory, `src/pages`));
  const exts = program.extensions.map(e => `${e.slice(1)}`).join(`,`);
  // TODO: handle any configured pages
  chokidar
    .watch(`**/*.{${exts}}`, { cwd: pageDir })
    .on('unlink', removedPath => {
      const componentPath = slash(path.join(pageDir, removedPath));
      const { pages } = store.getState();

      for (const [_, page] of pages) {
        if (page.componentPath === componentPath) {
          PageImports.delete(getPageImportKey(page));
          writeImportHash();
          break;
        }
      }
    })
    .on(`change`, changedPath => {
      const componentPath = slash(path.join(pageDir, changedPath));
      const { pages } = store.getState();

      for (const [_, page] of pages) {
        if (page.componentPath === componentPath) {
          // console.log('UPDATE FOUUUND');
          parsePageImports(page);
          break;
        }
      }
    });
};

module.exports.onCreatePage = async ({ page }) => {
  await parsePageImports(page);
};

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
  // console.log(getConfig().resolve.alias);
};
