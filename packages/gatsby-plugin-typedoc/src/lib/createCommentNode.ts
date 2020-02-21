const commentId = (parentId, type) => `${parentId}--${type}TypedocCommentValue`;

const toTextNodeFactory = ({
  createNode,
  createNodeId,
  createContentDigest,
  id
}) => (value, type: 'Text' | 'ShortText') => {
  const node = {
    value,
    id: createNodeId(commentId(id, type)),
    parent: id,
    children: [],
    internal: {
      type: `TypedocCommentValue`,
      mediaType: `text/markdown`,
      content: value,
      contentDigest: createContentDigest(value)
    }
  };

  createNode(node);
  return node;
};

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

  const toTextNode = toTextNodeFactory({
    createNode,
    createNodeId,
    createContentDigest,
    id: node.id
  });

  const commentNode: CommentNode = {
    ...entry,
    id: createNodeId(commentId(node.id, '')),
    parent: node.id,
    children: [],
    internal: {
      type: 'TypedocComment',
      contentDigest: createContentDigest(JSON.stringify(entry))
    }
  };

  if ('text' in entry) {
    const textNode = toTextNode(entry.text, 'Text');
    commentNode.text = textNode.id;
    commentNode.children.push(textNode.id);
  }

  if ('shortText' in entry) {
    const shortTextNode = toTextNode(entry.shortText, 'ShortText');
    commentNode.shortText = shortTextNode.id;
    commentNode.children.push(shortTextNode.id);
  }

  node.comment = commentNode.id;
  node.children = node.children.concat([commentNode.id]);
  createNode(commentNode);

  return node;
}

export default createCommentNode;
