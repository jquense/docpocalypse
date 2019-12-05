const { Application } = require('typedoc');
const groupby = require('lodash/groupBy');
const path = require('path');

const { findConfigFile, sys } = require('typescript');

exports.sourceNodes = (
  {
    actions,
    createNodeId,
    // getNode,
    // getNodesByType,
    createContentDigest,
    reporter
  },
  pluginOptions
) => {
  const { createNode } = actions;
  // const docNodes = getNodesByType('Docpocalypse');

  // const files = docNodes
  //   .map(d => getNode(d.file___NODE))
  //   .filter(f => f.ext === '.ts' || f.ext === '.tsx')
  //   .map(f => f.absolutePath);

  // console.log(configs);

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

  const sources = [].concat(src);
  const filesByConfig = groupby(sources, f =>
    findConfigFile(path.dirname(f), sys.fileExists)
  );
  console.log(filesByConfig);
  // eslint-disable-next-line no-shadow
  Object.entries(filesByConfig).forEach(([tsconfig, src]) => {
    const app = new Application({ ...typedocOptions, tsconfig });
    const files = app.expandInputFiles(src);

    const data = app.serializer.projectToObject(app.convert(files));
    console.log(files, data);
    if (data) {
      const nodeData = processTypeDoc(data);
      createNode(nodeData);
    } else {
      reporter.error('Failed to generate TypeDoc');
    }
  });
};
