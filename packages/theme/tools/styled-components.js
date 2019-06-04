const { utils } = require('react-docgen');
const { default: resolveHOC } = require('react-docgen/dist/utils/resolveHOC');
const {
  default: resolveToModule,
} = require('react-docgen/dist/utils/resolveToModule');

module.exports = ({ moduleName = 'styled-components' } = {}) => {
  const isStyledExpression = (tagPath, t) =>
    (t.CallExpression.check(tagPath.node) &&
      tagPath.get('callee').node.name === 'styled') ||
    (t.MemberExpression.check(tagPath.node) &&
      tagPath.get('object').node.name === 'styled');

  function isStyledComponent(def, t) {
    if (
      !t.TaggedTemplateExpression.check(def.node) ||
      !isStyledExpression(def.get('tag'), t)
    ) {
      return false;
    }
    const module = resolveToModule(def.get('tag'));
    return !!module && module === moduleName;
  }

  const exportTagged = (path, t) => {
    const definitions = utils.resolveExportDeclaration(path, t);
    const components = [];
    definitions.filter(Boolean).forEach(def => {
      let comp = def;
      if (isStyledComponent(comp, t)) {
        components.push(comp);
      } else {
        if (t.CallExpression.check(comp.node)) {
          const callee = comp.get('callee');

          if (
            utils.match(callee.node, {
              object: { name: 'Object' },
              property: { name: 'assign' },
            })
          ) {
            comp = comp.get('arguments', 0);
          }
        }
        comp = utils.resolveToValue(resolveHOC(comp));

        if (isStyledComponent(comp, t)) components.push(comp);
      }
    });
    return components;
  };

  function findExportedStyledComponent(ast, recast) {
    const components = [];
    const t = recast.types.namedTypes;

    const visitor = path => {
      components.push(...exportTagged(path, t));
      return false;
    };

    recast.visit(ast, {
      visitFunctionDeclaration: false,
      visitFunctionExpression: false,
      visitClassDeclaration: false,
      visitClassExpression: false,
      visitIfStatement: false,
      visitWithStatement: false,
      visitSwitchStatement: false,
      visitCatchCause: false,
      visitWhileStatement: false,
      visitDoWhileStatement: false,
      visitForStatement: false,
      visitForInStatement: false,

      visitExportDefaultDeclaration: visitor,
    });

    return components;
  }

  function findAllExportedStyledComponents(ast, recast) {
    const components = [];
    const t = recast.types.namedTypes;

    const visitor = path => {
      components.push(...exportTagged(path, t));
      return false;
    };

    recast.visit(ast, {
      visitFunctionDeclaration: false,
      visitFunctionExpression: false,
      visitClassDeclaration: false,
      visitClassExpression: false,
      visitIfStatement: false,
      visitWithStatement: false,
      visitSwitchStatement: false,
      visitCatchCause: false,
      visitWhileStatement: false,
      visitDoWhileStatement: false,
      visitForStatement: false,
      visitForInStatement: false,

      visitExportDeclaration: visitor,
      visitExportNamedDeclaration: visitor,
      visitExportDefaultDeclaration: visitor,
    });
    return components;
  }

  function findAllStyledComponents(ast, recast) {
    const components = [];
    const t = recast.types.namedTypes;

    recast.visit(ast, {
      visitFunctionDeclaration: false,
      visitFunctionExpression: false,
      visitClassDeclaration: false,
      visitClassExpression: false,
      visitIfStatement: false,
      visitWithStatement: false,
      visitSwitchStatement: false,
      visitCatchCause: false,
      visitWhileStatement: false,
      visitDoWhileStatement: false,
      visitForStatement: false,
      visitForInStatement: false,

      visitTaggedTemplateExpression(path) {
        let comp = path;
        if (isStyledComponent(path, t)) {
          components.push(path);
        } else {
          comp = utils.resolveToValue(resolveHOC(path));

          if (isStyledComponent(comp, t)) components.push(comp);
        }
        return false;
      },
    });
    return components;
  }

  return {
    findAllStyledComponents,
    findAllExportedStyledComponents,
    findExportedStyledComponent,
  };
};
