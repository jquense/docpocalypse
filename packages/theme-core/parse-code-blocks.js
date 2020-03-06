const { dirname } = require('path');
const { promises: fs } = require('fs');

const traverse = require('@babel/traverse').default;
const mdx = require('@mdx-js/mdx');
const { babelParseToAst } = require('gatsby/dist/utils/babel-parse-to-ast');
const visit = require('unist-util-visit');

const { isTypescript, canParse } = require('./can-parse');

const compiler = mdx.createMdxAstCompiler({
  defaultLayouts: {},
  extensions: [`.mdx`],
  mediaTypes: [`text/markdown`, `text/x-markdown`],
  rehypePlugins: [],
  remarkPlugins: [],
  plugins: [],
  root: process.cwd(),
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

const defaultIgnore = (lang, meta) =>
  meta.static === true || (!canParse(lang) && meta.live !== true);

const parseCodeBlocks = (mdxNode, { ignore = defaultIgnore } = {}) => {
  // const payloadCacheKey = `docpocalypse-mdx-cache-${mdxNode.internal.contentDigest}`;

  const mdxAST = compiler.parse(mdxNode.rawBody);

  const context = mdxNode.fileAbsolutePath
    ? dirname(mdxNode.fileAbsolutePath)
    : '';

  const imports = new Map();

  visit(mdxAST, 'code', node => {
    const { lang = 'js' } = node;
    const meta = parseProps(node) || {};

    if (ignore(lang, meta)) {
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
            type: 'IMPORT',
          });
        },
      });
    } catch {
      /* ignore */
    }
  });

  return Array.from(imports.values());
};

module.exports = parseCodeBlocks;

module.exports.fromFile = async (file, options) =>
  parseCodeBlocks(
    {
      rawBody: await fs.readFile(file, 'utf-8'),
      fileAbsolutePath: file,
    },
    options,
  );
