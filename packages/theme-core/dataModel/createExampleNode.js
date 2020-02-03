module.exports = function createExampleNode({
  node,
  actions,
  getNode,
  createNodeId
}) {
  const { createNode } = actions;
  const srcFile = getNode(node.parent);

  createNode({
    parent: node.id,
    id: createNodeId(`${srcFile.absolutePath}-example`),
    fileName: srcFile.name,
    absolutePath: srcFile.absolutePath,
    internal: {
      type: 'DocpocalypseExample',
      contentDigest: node.internal.contentDigest
    }
  });
};

module.exports.canCreate = ({ node, getNode }) => {
  if (node.internal.type === 'Mdx') {
    const parentFile = node.parent && getNode(node.parent);

    if (parentFile && parentFile.sourceInstanceName === '@docs::examples') {
      return true;
    }
  }
  return false;
};
