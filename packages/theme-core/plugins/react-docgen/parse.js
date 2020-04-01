const { codeFrameColumns } = require('@babel/code-frame');
const { handlers: h, parse, resolver } = require('react-docgen');
const { ERROR_MISSING_DEFINITION } = require('react-docgen/dist/parse');

const { createDisplayNameHandler } = require('./displayname-handler');
const tagsHandler = require('./tags-handler');

const defaultHandlers = [
  h.propTypeHandler,
  h.propTypeCompositionHandler,
  h.propDocBlockHandler,
  h.flowTypeHandler,
  h.defaultPropsHandler,
  h.componentDocblockHandler,
  h.componentMethodsHandler,
  h.componentMethodsJsDocHandler,
];

let fileCount = 0;

/**
 * Wrap handlers to pass in additional arguments such as the File node
 */
function makeHandlers(node, handlers) {
  handlers = (handlers || []).map(handler => (...args) =>
    handler(...args, node),
  );
  return [
    createDisplayNameHandler(
      node.absolutePath || `/UnknownComponent${++fileCount}`,
    ),
    tagsHandler,
    ...handlers,
  ];
}

module.exports = function parseMetadata(content, node, options) {
  let components = [];
  const { handlers, resolver: userResolver, ...parseOptions } = options || {};
  try {
    components = parse(
      content,
      userResolver || resolver.findAllComponentDefinitions,
      defaultHandlers.concat(makeHandlers(node, handlers)),
      {
        ...parseOptions,
        filename: node.absolutePath,
      },
    );
  } catch (err) {
    if (err.message === ERROR_MISSING_DEFINITION) return [];
    // reset the stack to here since it's not helpful to see all the react-docgen guts
    // const parseErr = new Error(err.message)
    if (err.loc) {
      err.codeFrame = codeFrameColumns(
        content,
        err.loc.start || { start: err.loc },
        {
          highlightCode: true,
        },
      );
    }
    throw err;
  }

  if (components.length === 1) {
    components[0].displayName = components[0].displayName.replace(/\d+$/, ``);
  }

  components.forEach(component => {
    component.props = Object.entries(component.props || {}).map(
      ([propName, prop]) => {
        prop.name = propName;

        return prop;
      },
    );
  });

  return components;
};
