const path = require('path');

const findPkg = require('find-pkg');
const { Kind } = require('gatsby-plugin-typedoc/lib/types');

const isComponent = node => node.internal.type === 'ComponentMetadata';

const isHook = node => {
  const isDocJs =
    node.internal.type === 'DocumentationJs' &&
    node.kind === 'function' &&
    node.name &&
    node.name.match(/^use[A-Z]/);

  const isTypeDoc =
    node.internal.type === 'TypedocNode' &&
    node.kind === Kind.Function &&
    node.name &&
    node.name.match(/^use[A-Z]/);

  return isDocJs || isTypeDoc;
};

const nodeType = 'Docpocalypse';

const getNameFromNode = node => node.displayName || node.name;

function getFile(node, getNode, getNodesByType) {
  let file = getNode(node.parent);

  if (node.absolutePath && (!file || file.internal.type !== 'File'))
    file = getNodesByType('File').find(
      f => f.absolutePath === node.absolutePath,
    );

  if (file && file.sourceInstanceName.match(/^@docs::source/)) return file;
  return null;
}

module.exports = async function createDocpocalypseNode(
  { node, getNode, getNodesByType, actions, createNodeId, createContentDigest },
  pluginOptions,
) {
  const { getImportName, ignore } = pluginOptions;
  const { createNode, createNodeField } = actions;
  const isComp = isComponent(node);

  const type = isComp ? 'component' : 'hook';
  const srcFile = getFile(node, getNode, getNodesByType);

  if (!srcFile) {
    return;
  }

  function createBaseNode() {
    const name = getNameFromNode(node) || srcFile.name;

    let currentNode = getNodesByType(nodeType).find(
      n => n.name === name && n.absolutePath === srcFile.absolutePath,
    );

    if (!currentNode) {
      // needs to be sync to avoid race condition with other nodes for some reason
      let pkgJson = findPkg.sync(srcFile.dir);

      const rootDir = pkgJson && path.dirname(pkgJson);

      pkgJson = pkgJson && require(pkgJson);

      currentNode = {
        type,
        name,
        rootDir,
        parent: srcFile.id,
        fileName: srcFile.name,
        absolutePath: srcFile.absolutePath,
        id: createNodeId(`${srcFile.absolutePath}-${name}`),
        children: [node.id, srcFile.id],
        package: pkgJson,
        packageName: pkgJson && pkgJson.name,
        file___NODE: srcFile.id,
        internal: {
          contentDigest: createContentDigest(`${node.id}-${name}`),
          type: nodeType,
        },
      };

      currentNode.importName = getImportName
        ? getImportName(currentNode, srcFile)
        : '';

      if (ignore && ignore(currentNode)) {
        return null;
      }

      createNode(currentNode);
    }

    return currentNode;
  }

  const baseNode = await createBaseNode();

  if (!baseNode) {
    return;
  }

  switch (node.internal.type) {
    case 'ComponentMetadata': {
      createNodeField({
        node: baseNode,
        name: 'metadataId',
        value: node.id,
      });
      return;
    }
    case 'DocumentationJs': {
      const others = (baseNode.fields && baseNode.fields.docJsIds) || [];
      if (!others.includes(node.id))
        createNodeField({
          node: baseNode,
          name: 'docJsIds',
          value: [...others, node.id],
        });
      return;
    }
    case 'TypedocNode':
      createNodeField({
        node: baseNode,
        name: 'typedocId',
        value: node.id,
      });
      return;
    default:
      throw new Error('this is weird');
  }
};

module.exports.canCreate = ({ node }) => isComponent(node) || isHook(node);
