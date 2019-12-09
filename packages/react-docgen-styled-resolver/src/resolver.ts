import astTypes, { ASTNode, NodePath } from 'ast-types';
import { resolver, utils } from '@monastic.panic/react-docgen';
import resolveHOC from '@monastic.panic/react-docgen/dist/utils/resolveHOC';
import { isStyledComponent } from './utils';

const { namedTypes: t, visit } = astTypes;

interface Options {
  moduleName?: string;
}

export function createStyledResolvers({ moduleName }: Options = {}) {
  const exportTagged = (path: NodePath) => {
    const definitions = utils.resolveExportDeclaration(path, t) as NodePath[];
    const components = [] as NodePath[];

    definitions.filter(Boolean).forEach(def => {
      let comp = def;
      if (isStyledComponent(comp, moduleName)) {
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

        if (isStyledComponent(comp, moduleName)) components.push(comp);
      }
    });
    return components;
  };

  function findExportedStyledComponent(ast: ASTNode) {
    const components = [] as NodePath[];

    const visitor = (path: NodePath) => {
      components.push(...exportTagged(path));
      return false;
    };

    visit(ast, {
      visitExportDefaultDeclaration: visitor
    });

    return components;
  }

  function findAllExportedStyledComponents(ast: ASTNode) {
    const components = [] as NodePath[];

    const visitor = (path: NodePath) => {
      components.push(...exportTagged(path));
      return false;
    };

    visit(ast, {
      visitExportDeclaration: visitor,
      visitExportNamedDeclaration: visitor,
      visitExportDefaultDeclaration: visitor
    });
    return components;
  }

  function findAllStyledComponents(ast: ASTNode) {
    const components = [] as NodePath[];

    visit(ast, {
      visitTaggedTemplateExpression(path) {
        let comp = path;
        if (isStyledComponent(path, moduleName)) {
          components.push(path);
        } else {
          comp = utils.resolveToValue(resolveHOC(path));

          if (isStyledComponent(comp, moduleName)) components.push(comp);
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
}

const styledResolvers = createStyledResolvers();

export default (ast: ASTNode) => {
  const styled = styledResolvers.findAllExportedStyledComponents(ast);

  const exportedComponents = resolver.findAllExportedComponentDefinitions(ast);

  return styled.concat(exportedComponents);
};
