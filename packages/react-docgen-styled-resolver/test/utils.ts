/* eslint-disable no-underscore-dangle */
/**
 * Helper methods for tests.
 */

import { ASTNode } from 'ast-types';
import buildParser from '@monastic.panic/react-docgen/dist/babelParser';

function stringify(value) {
  if (Array.isArray(value)) {
    return value.join('\n');
  }
  return value;
}

export function getParser(options = {}) {
  return buildParser(options);
}

/**
 * Returns a NodePath to the program node of the passed node
 */
export function parse(src: string, options = {}): ASTNode {
  const ast = getParser(options).parse(stringify(src));
  // @ts-ignore
  ast.__src = src;
  return ast;
}

// export function statement(src: string, options = {}): NodePath {
//   return parse(src, options).get('program').get('body', 0);
// }

// export function expression(src: string, options = {}): NodePath {
//   return statement(`(${src})`, options).get('expression');
// }

/**
 * Injects src into template by replacing the occurrence of %s.
 */
export function parseWithTemplate(src: string, template: string) {
  return parse(template.replace('%s', stringify(src)));
}

/**
 * Default template that simply defines React and PropTypes.
 */
export const REACT_TEMPLATE = [
  'var React = require("React");',
  'var PropTypes = React.PropTypes;',
  'var {PropTypes: OtherPropTypes} = require("React");',
  '%s;'
].join('\n');

export const MODULE_TEMPLATE = [
  'var React = require("React");',
  'var PropTypes = React.PropTypes;',
  'var Component = React.createClass(%s);',
  'module.exports = Component'
].join('\n');
