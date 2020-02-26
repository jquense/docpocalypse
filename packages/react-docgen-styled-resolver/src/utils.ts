import { namedTypes as t } from 'ast-types';
import resolveToModule from 'react-docgen/dist/utils/resolveToModule';

export const isSimpleStyled = (tagPath: any) =>
  t.CallExpression.check(tagPath.node) &&
  t.Identifier.check(tagPath.get('callee').node) &&
  tagPath.get('callee').node.name.endsWith('styled');

export const isAttrsStyled = (tagPath: any) =>
  t.CallExpression.check(tagPath.node) &&
  t.MemberExpression.check(tagPath.get('callee').node) &&
  tagPath
    .get('callee')
    .get('object')
    .get('callee')
    .node.name.endsWith('styled');

export const isShorthandStyled = (tagPath: any) =>
  t.MemberExpression.check(tagPath.node) &&
  t.Identifier.check(tagPath.get('object').node) &&
  tagPath.get('object').node.name.endsWith('styled');

export const isStyledExpression = (tagPath: any) =>
  isSimpleStyled(tagPath) ||
  isAttrsStyled(tagPath) ||
  isShorthandStyled(tagPath);

export function isStyledComponent(def: any, moduleName?: string) {
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
