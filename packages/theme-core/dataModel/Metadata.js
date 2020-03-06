const { promises: fs } = require('fs');
const capitalize = require('lodash/capitalize');
const parseCodeBlocks = require('../parse-code-blocks');

function unslugify(path) {
  const lastSegment = path
    .split('/')
    .filter(Boolean)
    .pop();

  return lastSegment && capitalize(lastSegment.replace(/[-_]/g, ' '));
}

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    SitePage: {
      docpocalypse: {
        type: 'DocpocalypsePage',
        resolve: async src => {
          if (src.path.includes('404')) {
            return null;
          }

          let title;
          let codeBlockImports = [];
          // Mdx adds frontmatter to the page context
          if (src.context && src.context.frontmatter)
            title = src.context.frontmatter.title;

          if (src.componentPath.endsWith('.mdx')) {
            const rawBody = await fs.readFile(src.componentPath, 'utf-8');

            codeBlockImports = parseCodeBlocks({
              rawBody,
              fileAbsolutePath: src.componentPath,
            });
          }

          return {
            title: title || unslugify(src.path),
            codeBlockImports,
          };
        },
      },
    },
  });
};
