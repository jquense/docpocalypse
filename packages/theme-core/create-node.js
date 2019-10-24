const findPkg = require('find-pkg');
const path = require('path');

const isComponent = node => node.internal.type === 'ComponentMetadata';

const isHook = node =>
  node.internal.type === 'DocumentationJs' &&
  node.name &&
  node.name.match(/^use[A-Z]/);

// function defaultImport(node, fileNode) {
//   if (node.package && node.package.main) {
//     return `import {${}}`
//   }
// }

exports.onCreateNode = async function onCreateNode(
  {
    node,
    getNode,
    getNodesByType,
    actions,
    createNodeId,
    createContentDigest,
  },
  pluginOptions,
) {
  const { getImportName } = pluginOptions;
  const { createNode } = actions;
  const isComp = isComponent(node);

  if (isHook(node) || isComp) {
    const srcFile = getNode(node.parent);

    if (!srcFile || !srcFile.sourceInstanceName.match(/^@docs::source/)) {
      return;
    }
    const displayName = isComp ? node.displayName : node.name;

    const exampleMdx = getNodesByType('Mdx').find(n => {
      const exampleFile = n.parent && getNode(n.parent);
      return (
        exampleFile &&
        exampleFile.sourceInstanceName === '@docs::examples' &&
        (exampleFile.name === srcFile.name || exampleFile.name === displayName)
      );
    });

    let pkgJson = await findPkg(srcFile.dir);
    const rootDir = pkgJson && path.dirname(pkgJson);

    pkgJson = pkgJson && require(pkgJson);

    const name = displayName || srcFile.name;
    const docNode = {
      name,
      rootDir,
      type: isComp ? 'component' : 'hook',
      id: createNodeId(`${node.id}-${name}`),
      children: [node.id, srcFile.id],
      package: pkgJson,
      packageName: pkgJson && pkgJson.name,
      metadata___NODE: isComp ? node.id : undefined,
      documentation___NODE: !isComp ? node.id : undefined,
      internal: {
        contentDigest: createContentDigest(`${node.id}-${name}`),
        type: `Docpocalypse`,
      },
    };

    docNode.importName = getImportName ? getImportName(docNode, srcFile) : '';

    if (exampleMdx) {
      docNode.children.push(exampleMdx.id);
      docNode.example___NODE = exampleMdx.id;
    }
    createNode(docNode);
  }
};

exports.sourceNodes = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(/* GraphQL */ `
    type Docpocalypse implements Node @infer {
      type: String!
      name: String!
      rootDir: String
      package: JSON
      packageName: String
      importName: String
      metadata: ComponentMetadata @link(from: "metadata___NODE")
      documentation: DocumentationJs @link(from: "documentation___NODE")
      example: Mdx @link(from: "example___NODE")
    }
  `);
};
