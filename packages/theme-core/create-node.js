const findPkg = require('find-pkg');
const path = require('path');

const parseCodeBlocks = require('./parse-code-blocks');

const isComponent = node => node.internal.type === 'ComponentMetadata';

const isHook = node =>
  node.internal.type === 'DocumentationJs' &&
  node.name &&
  node.name.match(/^use[A-Z]/);

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    Mdx: {
      codeBlockImports: {
        type: ['CodeBlockImport'],
        resolve: parseCodeBlocks
      }
    }
  });
};

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;

  createTypes([
    /* GraphQL */ `
      enum ImportType {
        IMPORT
        REQUIRE
      }

      type CodeBlockImport {
        type: ImportType!
        request: String!
        context: String!
      }
    `,
    schema.buildObjectType({
      name: 'Docpocalypse',
      interfaces: ['Node'],
      fields: {
        type: 'String!',
        name: 'String!',
        fileName: 'String!',
        rootDir: 'String',
        package: 'JSON',
        packageName: 'String',
        importName: 'String',

        metadata: {
          type: 'ComponentMetadata',
          resolve: (source, _, context) =>
            context.nodeModel.getNodeById({
              type: 'ComponentMetadata',
              id: source.metadata___NODE
            })
        },
        documentation: {
          type: 'DocumentationJs',
          resolve: (source, _, context) =>
            context.nodeModel.getNodeById({
              type: 'DocumentationJs',
              id: source.documentation___NODE
            })
        },
        example: {
          type: 'Mdx',
          resolve: (source, args, context) => {
            // console.log(source);
            return context.nodeModel
              .getAllNodes({ type: 'Mdx' })
              .find(example => {
                const exampleFile =
                  example.parent &&
                  context.nodeModel.getNodeById({
                    type: 'File',
                    id: example.parent
                  });

                return (
                  exampleFile &&
                  exampleFile.sourceInstanceName === '@docs::examples' &&
                  (exampleFile.name === source.fileName ||
                    exampleFile.name === source.displayName)
                );
              });
          }
        }
      }
    })
  ]);
};

exports.onCreateNode = async function onCreateNode(
  { node, getNode, actions, createNodeId, createContentDigest },
  pluginOptions
) {
  const { getImportName, ignore } = pluginOptions;
  const { createNode } = actions;
  const isComp = isComponent(node);

  if (isHook(node) || isComp) {
    const srcFile = getNode(node.parent);

    if (!srcFile || !srcFile.sourceInstanceName.match(/^@docs::source/)) {
      return;
    }
    const displayName = isComp ? node.displayName : node.name;

    let pkgJson = await findPkg(srcFile.dir);
    const rootDir = pkgJson && path.dirname(pkgJson);

    pkgJson = pkgJson && require(pkgJson);

    const name = displayName || srcFile.name;
    const docNode = {
      name,
      rootDir,
      fileName: srcFile.name,
      type: isComp ? 'component' : 'hook',
      id: createNodeId(`${node.id}-${name}`),
      children: [node.id, srcFile.id],
      package: pkgJson,
      packageName: pkgJson && pkgJson.name,
      file___NODE: srcFile.id,
      metadata___NODE: isComp ? node.id : undefined,
      documentation___NODE: !isComp ? node.id : undefined,
      internal: {
        contentDigest: createContentDigest(`${node.id}-${name}`),
        type: `Docpocalypse`
      }
    };

    docNode.importName = getImportName ? getImportName(docNode, srcFile) : '';

    if (ignore && ignore(docNode)) {
      return;
    }

    createNode(docNode);
  }
};
