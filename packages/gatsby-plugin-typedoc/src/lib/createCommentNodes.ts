interface CommentNode {
  id: string;
  parent: string;
  children: string[];
  text?: string;
  shortText?: string;
  tags?: any;
  internal: any;
}

function createCommentNodes(
  node,
  entry: {
    tags?: string[];
    text?: string;
    shortText?: string;
    returns?: string;
  },
  actions,
  createNodeId,
  createContentDigest,
) {
  const { createNode } = actions;

  const body = [entry.shortText, entry.text].filter(Boolean).join('\n');

  node.tags = entry.tags;

  const descriptionNode: any = {
    id: createNodeId(`${node.id}--TypedocCommentText-description`),
    parent: node.id,
    children: [],
    internal: {
      type: 'TypedocCommentText',
      mediaType: `text/markdown`,
      content: body,
      contentDigest: createContentDigest(body),
    },
  };

  node.description = descriptionNode.id;
  node.children.push(descriptionNode.id);

  createNode(descriptionNode);

  if (entry.returns) {
    const returnsDescriptionNode = {
      id: createNodeId(`${node.id}--TypedocCommentText-returnsDescription`),
      parent: node.id,
      children: [],
      internal: {
        type: 'TypedocCommentText',
        mediaType: `text/markdown`,
        content: entry.returns,
        contentDigest: createContentDigest(entry.returns),
      },
    };

    delete node.comment;

    node.returnsDescription = returnsDescriptionNode.id;
    node.children.push(returnsDescriptionNode.id);

    createNode(returnsDescriptionNode);
  }

  return node;
}

export default createCommentNodes;
