const { Application } = require('typedoc');

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest, reporter },
  pluginOptions
) => {
  const { createNode } = actions;

  function processTypeDoc(generated) {
    const nodeId = createNodeId(`typedoc-${generated.name || 'default'}`);
    const nodeContent = JSON.stringify(generated);

    const nodeData = {
      id: nodeId,
      source: generated,
      internal: {
        type: 'Typedoc',
        content: nodeContent,
        contentDigest: createContentDigest(generated)
      }
    };

    return nodeData;
  }

  const { src, typedoc: typedocOptions = {} } = pluginOptions;

  const app = new Application(typedocOptions);

  const data = app.serializer.projectToObject(
    app.convert(app.expandInputFiles(src))
  );

  if (data) {
    const nodeData = processTypeDoc(data);
    createNode(nodeData);
  } else {
    reporter.error('Failed to generate TypeDoc');
  }
};
