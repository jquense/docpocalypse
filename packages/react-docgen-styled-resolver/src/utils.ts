import astTypes, { NodePath } from 'ast-types';
import resolveToModule from '@monastic.panic/react-docgen/dist/utils/resolveToModule';

const t = astTypes.namedTypes;

export const isSimpleStyled = (tagPath: NodePath) =>
  t.CallExpression.check(tagPath.node) &&
  tagPath.get('callee').node.name === 'styled';

export const isAttrsStyled = (tagPath: NodePath) =>
  t.CallExpression.check(tagPath.node) &&
  t.MemberExpression.check(tagPath.get('callee').node) &&
  tagPath
    .get('callee')
    .get('object')
    .get('callee').node.name === 'styled';

export const isShorthandStyled = (tagPath: NodePath) =>
  t.MemberExpression.check(tagPath.node) &&
  tagPath.get('object').node.name === 'styled';

export const isStyledExpression = (tagPath: NodePath) =>
  isSimpleStyled(tagPath) ||
  isAttrsStyled(tagPath) ||
  isShorthandStyled(tagPath);

export function isStyledComponent(def: NodePath, moduleName?: string) {
  if (
    !t.TaggedTemplateExpression.check(def.node) ||
    !isStyledExpression(def.get('tag'))
  ) {
    return false;
  }

  if (!moduleName) return true;

  const module = resolveToModule(def.get('tag'));
  return !!module && module === moduleName;
}
