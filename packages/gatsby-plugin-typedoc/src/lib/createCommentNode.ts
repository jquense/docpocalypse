const commentId = parentId => `${parentId}--TypedocComment`;

interface CommentNode {
  id: string;
  parent: string;
  children: string[];
  text?: string;
  shortText?: string;
  tags?: any;
  internal: any;
}

function createCommentNode(
  node,
  entry: { tags?: string[]; text?: string; shortText?: string },
  actions,
  createNodeId,
  createContentDigest
) {
  const { createNode } = actions;

  const value = [entry.shortText, entry.text].filter(Boolean).join('\n');

  const commentNode: CommentNode = {
    id: createNodeId(commentId(node.id)),
    parent: node.id,
    children: [],
    internal: {
      type: 'TypedocComment',
      mediaType: `text/markdown`,
      content: value,
      contentDigest: createContentDigest(value)
    }
  };

  node.comment = commentNode.id;
  node.children = node.children.concat([commentNode.id]);
  createNode(commentNode);

  return node;
}

export default createCommentNode;
