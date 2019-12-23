const findPkg = require('find-pkg');
const path = require('path');
const { Kind } = require('gatsby-plugin-typedoc/types');
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
      // extensions: ['dontInfer'],
      fields: {
        type: 'String!',
        name: 'String!',
        fileName: 'String!',
        absolutePath: 'String!',
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
        // typedoc: {
        //   type: 'TypedocNode',
        //   resolve: (source, _, context) =>
        //     context.nodeModel.getNodeById({
        //       type: 'TypedocNode',
        //       id: source.typedoc___NODE
        //     })
        // },
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
              .getAllNodes(
                { type: 'Mdx' },
                { path: context.path, connectionType: 'Mdx ' }
              )
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
  { node, getNode, actions, createNodeId, createContentDigest, getNodesByType },
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

    let pkgJson = await findPkg(srcFile.dir);
    const rootDir = pkgJson && path.dirname(pkgJson);

    pkgJson = pkgJson && require(pkgJson);

    const displayName = isComp ? node.displayName : node.name;

    const name = displayName || srcFile.name;

    const typeNode = isComp
      ? null
      : getNodesByType('TypedocNode').find(
          n => n.kind === Kind.Function && n.name === name
        );

    const docNode = {
      name,
      rootDir,
      parent: srcFile.id,
      fileName: srcFile.name,
      absolutePath: srcFile.absolutePath,
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

    if (typeNode) {
      docNode.typedoc___NODE = typeNode.id;
    }

    docNode.importName = getImportName ? getImportName(docNode, srcFile) : '';

    if (ignore && ignore(docNode)) {
      return;
    }

    createNode(docNode);
  }
};
