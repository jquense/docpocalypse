const { resolver } = require('react-docgen');
const createStyledResolvers = require('./styled-components');

const { findAllExportedStyledComponents } = createStyledResolvers({
  moduleName: 'astroturf',
});

module.exports = (ast, recast) => {
  const styled = findAllExportedStyledComponents(ast, recast);

  const exportedComponents = resolver.findAllExportedComponentDefinitions(
    ast,
    recast,
  );

  return styled.concat(exportedComponents);
};
