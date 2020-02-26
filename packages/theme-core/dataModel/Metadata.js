const capitalize = require('lodash/capitalize');

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
      docpocalypseTitle: {
        type: 'String',
        resolve: src => {
          if (src.path === '/' || src.path.includes('404')) {
            return null;
          }

          let title;
          // Mdx adds frontmatter to the page context
          if (src.context && src.context.frontmatter)
            title = src.context.frontmatter.title;

          return title || unslugify(src.path);
        }
      }
    }
  });
};
