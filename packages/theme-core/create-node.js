const findPkg = require('find-pkg');
const path = require('path');
const DataUtils = require('./data-utils');

const metadataType = (type, fieldName) => ({
  type,
  resolve: DataUtils.passThroughResolver({
    fieldName,
    type: 'ComponentMetadata',
    parentId: 'fields.metadataId'
  })
});

const findByParent = (type, parentId, ctx) => {
  return ctx.nodeModel.getAllNodes({ type }).find(nn => nn.parent === parentId);
};

// const { Kind } = require('gatsby-plugin-typedoc/types');
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

function resolveDescriptionFromMetadata(src, ctx) {
  const descNode = DataUtils.resolveNodePath(
    src,
    'fields.metadataId.description',
    ctx
  );
  console.log('HI', descNode);
  if (!descNode) return null;

  return {
    text: descNode.text,
    mdx: descNode.fields.mdx,
    markdownRemark: descNode.fields.markdownRemark
  };
}

function resolveDescriptionFromDocJs(docId, ctx) {
  const descNode = findByParent(
    'DocumentationJSComponentDescription',
    docId,
    ctx
  );

  if (!descNode) return null;

  const nodes = ctx.nodeModel.getNodesByIds({
    ids: descNode.children
  });
  const mdx = nodes.find(d => d.internal.type === 'Mdx');
  const md = nodes.find(d => d.internal.type === 'MarkdownRemark');

  return {
    text: descNode.internal.content,
    mdx: mdx && mdx.id,
    markdownRemark: md && md.id
  };
}

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;

  createTypes([
    /* GraphQL */ `
      enum ImportType {
        IMPORT
        REQUIRE
      }

      type DocpocalypseTag {
        name: String
        value: JSON
      }

      type CodeBlockImport {
        type: ImportType!
        request: String!
        context: String!
      }

      type DocpocalypseDescription @dontInfer {
        text: String
        markdownRemark: MarkdownRemark @link
        mdx: Mdx @link
      }
    `,
    schema.buildObjectType({
      name: 'Docpocalypse2',
      interfaces: ['Node'],
      extensions: ['dontInfer'],
      fields: {
        type: 'String!',
        name: 'String!',
        fileName: 'String!',
        absolutePath: 'String!',
        rootDir: 'String',
        package: 'JSON',
        packageName: 'String',
        importName: 'String',
        description: {
          type: 'DocpocalypseDescription',
          resolve: (src, _, ctx) => {
            const { metadataId, documentationJsId } = src.fields;
            if (metadataId) return resolveDescriptionFromMetadata(src, ctx);
            if (documentationJsId)
              return resolveDescriptionFromDocJs(documentationJsId, ctx);
            return null;
          }
        },
        props: metadataType('[ComponentProp]'),
        composes: metadataType('[ComponentComposes]'),
        tags: {
          type: '[DocpocalypseTag]!',
          resolve: (src, _, ctx) => {
            if (src.fields.metadataId) {
              const node = DataUtils.getNodeById(src, 'fields.metadataId', ctx);
              return !node ? [] : node.tags;
            }

            if (src.fields.documentationJsId) {
              const node = DataUtils.getNodeById(
                src,
                'fields.documentationJsId',
                ctx
              );

              return !node
                ? []
                : node.tags.map(({ title, description }) => ({
                    name: title,
                    value: description
                  }));
            }
            return [];
          }
        }
      }
    }),
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
                  (exampleFile.name === source.name ||
                    exampleFile.name === source.fileName)
                );
              });
          }
        }
      }
    })
  ]);
};

function createNodeFromMetadata(srcFile, api, pluginOptions) {}

exports.onCreateNode = async function onCreateNode(
  { node, getNode, getNodesByType, actions, createNodeId, createContentDigest },
  pluginOptions
) {
  const { getImportName, ignore } = pluginOptions;
  const { createNode, createNodeField } = actions;
  const isComp = isComponent(node);

  if (!isHook(node) && !isComp) return;

  const srcFile = getNode(node.parent);

  if (!srcFile || !srcFile.sourceInstanceName.match(/^@docs::source/)) {
    return;
  }

  // function createHookNode(docNode) {
  //   return Object.assign(docNode, {
  //     tags: node.tags.map(({ title, description }) => ({
  //       name: title,
  //       value: description
  //     }))
  //   });
  // }

  let pkgJson = await findPkg(srcFile.dir);
  const rootDir = pkgJson && path.dirname(pkgJson);

  pkgJson = pkgJson && require(pkgJson);

  const displayName = isComp ? node.displayName : node.name;

  const name = displayName || srcFile.name;

  let currentNode = getNodesByType('Docpocalypse2').find(
    n => n.name === name && n.absolutePath === srcFile.absolutePath
  );

  console.log('current!', currentNode);
  if (!currentNode) {
    currentNode = {
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
      internal: {
        contentDigest: createContentDigest(`${node.id}-${name}`),
        type: `Docpocalypse2`
      }
    };

    currentNode.importName = getImportName
      ? getImportName(currentNode, srcFile)
      : '';

    if (ignore && ignore(currentNode)) {
      return;
    }

    createNode(currentNode);
    createNodeField({
      node: currentNode,
      name: isComp ? 'metadataId' : 'documentationJsId',
      value: node.id
    });
  } else {
  }
};
