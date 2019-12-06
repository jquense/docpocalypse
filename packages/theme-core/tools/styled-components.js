const { namedTypes: t, visit } = require('ast-types');
const { utils } = require('@monastic.panic/react-docgen');
const {
  default: resolveHOC
} = require('@monastic.panic/react-docgen/dist/utils/resolveHOC');
const {
  default: resolveToModule
} = require('@monastic.panic/react-docgen/dist/utils/resolveToModule');

const isSimpleStyled = tagPath =>
  t.CallExpression.check(tagPath.node) &&
  tagPath.get('callee').node.name === 'styled';

const isAttrsStyled = tagPath =>
  t.CallExpression.check(tagPath.node) &&
  t.MemberExpression.check(tagPath.get('callee').node) &&
  tagPath
    .get('callee')
    .get('object')
    .get('callee').node.name === 'styled';

const isShorthandStyled = tagPath =>
  t.MemberExpression.check(tagPath.node) &&
  tagPath.get('object').node.name === 'styled';

module.exports = ({ moduleName } = {}) => {
  const isStyledExpression = tagPath =>
    isSimpleStyled(tagPath) ||
    isAttrsStyled(tagPath) ||
    isShorthandStyled(tagPath);

  function isStyledComponent(def) {
    if (
      !t.TaggedTemplateExpression.check(def.node) ||
      !isStyledExpression(def.get('tag'), t)
    ) {
      return false;
    }

    if (!moduleName) return true;

    const module = resolveToModule(def.get('tag'));
    return !!module && module === moduleName;
  }

  const exportTagged = path => {
    const definitions = utils.resolveExportDeclaration(path, t);
    const components = [];
    definitions.filter(Boolean).forEach(def => {
      let comp = def;
      if (isStyledComponent(comp)) {
        components.push(comp);
      } else {
        if (t.CallExpression.check(comp.node)) {
          const callee = comp.get('callee');

          if (
            utils.match(callee.node, {
              object: { name: 'Object' },
              property: { name: 'assign' }
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

  function findExportedStyledComponent(ast) {
    const components = [];

    const visitor = path => {
      components.push(...exportTagged(path, t));
      return false;
    };

    visit(ast, {
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

      visitExportDefaultDeclaration: visitor
    });

    return components;
  }

  function findAllExportedStyledComponents(ast) {
    const components = [];

    const visitor = path => {
      components.push(...exportTagged(path));
      return false;
    };

    visit(ast, {
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
      visitExportDefaultDeclaration: visitor
    });
    return components;
  }

  function findAllStyledComponents(ast) {
    const components = [];

    visit(ast, {
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
      }
    });
    return components;
  }

  return {
    findAllStyledComponents,
    findAllExportedStyledComponents,
    findExportedStyledComponent
  };
};
