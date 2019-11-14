const { resolver } = require('@monastic.panic/react-docgen');
const createStyledResolvers = require('./styled-components');

const { findAllExportedStyledComponents } = createStyledResolvers();

module.exports = ast => {
  const styled = findAllExportedStyledComponents(ast);

  const exportedComponents = resolver.findAllExportedComponentDefinitions(ast);

  return styled.concat(exportedComponents);
};
