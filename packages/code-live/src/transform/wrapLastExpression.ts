import { Node, Plugin } from './types';

export default (): Plugin => ({
  visitor: {
    Program: {
      leave(node) {
        const lastExpr = node.body
          .concat()
          .reverse()
          .find((n: Node) => n.type === 'ExpressionStatement');

        if (!lastExpr) {
          return;
        }

        const { start, end } = lastExpr;

        const hasSemi = this.original.substring(start, end).endsWith(';');

        this.appendLeft(start, ';render(');

        if (hasSemi) this.overwrite(end - 1, end, ');');
        else this.appendRight(end, ');');
      }
    }
  }
});
