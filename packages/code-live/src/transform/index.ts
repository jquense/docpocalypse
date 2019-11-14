import { Parser } from 'acorn';
import acornJsx from 'acorn-jsx';
import { walk } from 'estree-walker';
import MagicString from 'magic-string';
import { Node, NormalVisitor, Plugin, VisitorMap } from './types';

const parser = Parser.extend(acornJsx());

const mergeVisitors = (visitors: VisitorMap[]) => {
  const rootVisitor: Record<string, NormalVisitor[]> = {};
  for (const visitor of visitors) {
    for (const key of Object.keys(visitor)) {
      const value = visitor[key];

      for (const type of key.split('|')) {
        const normalized =
          typeof value === 'function' ? { enter: value } : value;

        rootVisitor[type] = rootVisitor[type] || [];
        rootVisitor[type].push(normalized);
      }
    }
  }
  return rootVisitor;
};

export interface Options {
  plugins: Plugin[];
  file?: string;
  source?: string;
  includeContent?: boolean;
}

export function transform(source: string, options: Options = { plugins: [] }) {
  const { plugins } = options;
  const code = new MagicString(source);

  const ast = parser.parse(source, {
    ecmaVersion: 10,
    preserveParens: true,
    sourceType: 'module',
    allowAwaitOutsideFunction: true,
    allowReturnOutsideFunction: true,
    allowHashBang: true,
    onComment: (...args) => {
      plugins.forEach(p => p.onComment?.(...args));
    }
  });

  const visitors = mergeVisitors(plugins.map(p => p.visitor!).filter(Boolean));

  walk(ast as any, {
    enter(node: Node, parent: Node) {
      const visitor = visitors[node.type];
      if (visitor) {
        visitor.forEach(v => v.enter?.call(code, node, parent));
      }
    },
    leave(node, parent) {
      const visitor = visitors[node.type];
      if (visitor) {
        visitor.forEach(v => v.leave?.call(code, node, parent));
      }
    }
  });

  return {
    ast,
    code: code.toString(),
    map: code.generateMap({
      file: options.file,
      source: options.source,
      includeContent: options.includeContent !== false
    })
  };
}

// Step Five: Create the Yellow Cross

// F U R U’ R’ F’

// R U R’ U R U2 R’

// positioning corners:

// L’ U R U’ L U R’ R U R’ U R U2 R’

// edges:

// F2 U R’ L F2 L’ R U F2 (clockwise)

// F2 U’ R’ L F2 L’ R U’ F2 (counter-clockwise)
