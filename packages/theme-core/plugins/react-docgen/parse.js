const {
  handlers: h,
  parse,
  resolver
} = require('@monastic.panic/react-docgen');
const {
  ERROR_MISSING_DEFINITION
} = require('@monastic.panic/react-docgen/dist/parse');
const { codeFrameColumns } = require('@babel/code-frame');
const { createDisplayNameHandler } = require('./displayname-handler');
const { applyPropTags, cleanTags, parseTags } = require('./doclets');

const defaultHandlers = [
  h.propTypeHandler,
  h.propTypeCompositionHandler,
  h.propDocBlockHandler,
  h.flowTypeHandler,
  h.defaultPropsHandler,
  h.componentDocblockHandler,
  h.componentMethodsHandler,
  h.componentMethodsJsDocHandler
];

let fileCount = 0;

/**
 * Wrap handlers to pass in additional arguments such as the File node
 */
function makeHandlers(node, handlers) {
  handlers = (handlers || []).map(handler => (...args) =>
    handler(...args, node)
  );
  return [
    createDisplayNameHandler(
      node.absolutePath || `/UnknownComponent${++fileCount}`
    ),
    ...handlers
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
        filename: node.absolutePath
      }
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
          highlightCode: true
        }
      );
    }
    throw err;
  }

  if (components.length === 1) {
    components[0].displayName = components[0].displayName.replace(/\d+$/, ``);
  }

  components.forEach(component => {
    component.docblock = component.description || ``;
    component.tags = parseTags(component);
    component.description = cleanTags(component.description);

    component.props = Object.keys(component.props || {}).map(propName => {
      const prop = component.props[propName];
      prop.name = propName;
      prop.docblock = prop.description || ``;
      prop.tags = parseTags(prop, propName);
      prop.description = cleanTags(prop.description);

      applyPropTags(prop);
      return prop;
    });
  });

  return components;
};
