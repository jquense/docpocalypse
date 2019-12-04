const { babelParseToAst } = require('gatsby/dist/utils/babel-parse-to-ast');
const traverse = require('@babel/traverse').default;
const { dirname } = require('path');
const visit = require('unist-util-visit');
const mdx = require('@mdx-js/mdx');

const TYPESCRIPT = ['ts', 'tsx', 'typescript'];
const LANGUAGES = ['js', 'jsx', 'javascript', ...TYPESCRIPT];

const compiler = mdx.createMdxAstCompiler({
  defaultLayouts: {},
  extensions: [`.mdx`],
  mediaTypes: [`text/markdown`, `text/x-markdown`],
  rehypePlugins: [],
  remarkPlugins: [],
  plugins: [],
  root: process.cwd()
});

module.exports = mdxNode => {
  const mdxAST = compiler.parse(mdxNode.rawBody);

  const context = mdxNode.fileAbsolutePath
    ? dirname(mdxNode.fileAbsolutePath)
    : '';

  const imports = new Map();

  visit(mdxAST, 'code', node => {
    const { lang = 'js' } = node;

    if (!LANGUAGES.includes(lang.toLowerCase())) {
      return;
    }

    const isTS = TYPESCRIPT.includes(lang.toLowerCase());

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
  });

  return Array.from(imports.values());
};
