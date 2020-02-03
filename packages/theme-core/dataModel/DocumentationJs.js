exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    documentationJsComponentDescription: {
      mdx: {
        type: 'Mdx',
        resolve: (src, _, ctx) => {
          const nodes = ctx.nodeModel.getNodesByIds(
            { ids: src.children },
            { path: ctx.path, connectionType: 'Mdx' }
          );

          return nodes.find(d => d.internal.type === 'Mdx') || null;
        }
      },
      markdownRemark: {
        type: 'MarkdownRemark',
        resolve: (src, _, ctx) => {
          const nodes = ctx.nodeModel.getNodesByIds(
            { ids: src.children },
            { path: ctx.path, connectionType: 'MarkdownRemark' }
          );

          return nodes.find(d => d.internal.type === 'MarkdownRemark') || null;
        }
      }
    }
  });
};
