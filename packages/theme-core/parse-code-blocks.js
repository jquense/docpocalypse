const { babelParseToAst } = require('gatsby/dist/utils/babel-parse-to-ast');
const traverse = require('@babel/traverse').default;
const { dirname } = require('path');
const visit = require('unist-util-visit');
const mdx = require('@mdx-js/mdx');

const { isTypescript, canParse } = require('./can-parse');

const compiler = mdx.createMdxAstCompiler({
  defaultLayouts: {},
  extensions: [`.mdx`],
  mediaTypes: [`text/markdown`, `text/x-markdown`],
  rehypePlugins: [],
  remarkPlugins: [],
  plugins: [],
  root: process.cwd()
});

const parseProps = node => {
  return (
    node.meta &&
    node.meta.split(' ').reduce((acc, cur) => {
      if (cur.split('=').length > 1) {
        const t = cur.split('=');
        acc[t[0]] = t[1];
        return acc;
      }

      acc[cur] = true;
      return acc;
    }, {})
  );
};

module.exports = mdxNode => {
  const mdxAST = compiler.parse(mdxNode.rawBody);

  const context = mdxNode.fileAbsolutePath
    ? dirname(mdxNode.fileAbsolutePath)
    : '';

  const imports = new Map();

  visit(mdxAST, 'code', node => {
    const { lang = 'js' } = node;
    const meta = parseProps(node) || {};

    if (meta.static === true || (!canParse(lang) && meta.live !== true)) {
      return;
    }

    const isTS = isTypescript(lang);
    try {
      const ast = babelParseToAst(node.value, `example.${isTS ? 'tsx' : 'js'}`);
      traverse(ast, {
        ImportDeclaration(path) {
          const request = path.node.source.value;

          imports.set(request, {
            request,
            context,
            type: 'IMPORT'
          });
        }
      });
    } catch {
      /* ignore */
    }
  });

  return Array.from(imports.values());
};
