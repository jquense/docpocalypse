const findPkg = require('find-pkg');
const path = require('path');
const {
  resolveNodePath,
  getNodeById,
  passThroughResolver
} = require('./data-utils');

const mdxType = (type, fieldName) => ({
  type,
  resolve: passThroughResolver({
    fieldName,
    type: 'Mdx'
  })
});

const metadataType = (type, fieldName) => ({
  type,
  resolve: passThroughResolver({
    fieldName,
    type: 'ComponentMetadata',
    parentId: 'fields.metadataId'
  })
});
// const docJsType = (type, fieldName) => ({
//   type,
//   resolve: passThroughResolver({
//     fieldName,
//     type: 'DocumentationJs',
//     parentId: 'fields.docJsIds'
//   })
// });

// const findByParent = (type, parentId, ctx) => {
//   return ctx.nodeModel.getAllNodes({ type }).find(nn => nn.parent === parentId);
// };

// const { Kind } = require('gatsby-plugin-typedoc/types');
const parseCodeBlocks = require('./parse-code-blocks');

const isComponent = node => node.internal.type === 'ComponentMetadata';

const isHook = node =>
  node.internal.type === 'DocumentationJs' &&
  node.name &&
  node.name.match(/^use[A-Z]/);

// exports.createResolvers = ({ createResolvers }) => {
//   createResolvers({
//     Mdx: {
//       codeBlockImports: {
//         type: ['CodeBlockImport'],
//         resolve: parseCodeBlocks
//       }
//     }
//   });
// };

// function resolveDescriptionFromMetadata(src, ctx) {
//   const descNode = resolveNodePath(src, 'fields.metadataId.description', ctx);

//   if (!descNode) return null;

//   return {
//     text: descNode.text,
//     mdx: descNode.fields.mdx,
//     markdownRemark: descNode.fields.markdownRemark
//   };
// }

// function resolveDescriptionFromDocJs(docId, ctx) {
//   const descNode = findByParent(
//     'DocumentationJSComponentDescription',
//     docId,
//     ctx
//   );

//   if (!descNode) return null;

//   const nodes = ctx.nodeModel.getNodesByIds({
//     ids: descNode.children
//   });
//   const mdx = nodes.find(d => d.internal.type === 'Mdx');
//   const md = nodes.find(d => d.internal.type === 'MarkdownRemark');

//   return {
//     text: descNode.internal.content,
//     mdx: mdx && mdx.id,
//     markdownRemark: md && md.id
//   };
// }

const interfaceFields = {
  type: 'String!',
  name: 'String!',
  fileName: 'String!',
  absolutePath: 'String!',
  rootDir: 'String',
  package: 'JSON',
  packageName: 'String',
  importName: 'String'
};

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

      # interface DocpocalypseEntity {
      #   type: String!
      #   name: String!
      #   fileName: String!
      #   absolutePath: String!
      #   rootDir: String
      #   package: JSON
      #   packageName: String
      #   importName: String
      #   tags: [DocpocalypseTag]!
      # }
    `,
    // schema.buildObjectType({
    //   name: 'DocpocalypseHookSignature',
    //   extensions: ['dontInfer'],
    //   fields: {}
    // }),
    schema.buildObjectType({
      name: 'DocpocalypseExample',
      interfaces: ['Node'],
      extensions: ['dontInfer'],
      fields: {
        absolutePath: 'String!',
        headings: mdxType('[MdxHeadingMdx]'),
        frontmatter: mdxType('MdxFrontmatter'),
        body: mdxType('String'),
        codeBlockImports: {
          type: ['CodeBlockImport'],
          resolve: (src, _, ctx) =>
            parseCodeBlocks(getNodeById(src, 'parent', ctx))
        }
      }
    }),
    schema.buildObjectType({
      name: 'Docpocalypse',
      interfaces: ['Node'],
      extensions: ['dontInfer'],
      fields: {
        ...interfaceFields,
        example: {
          type: 'DocpocalypseExample',
          resolve: (source, args, context) => {
            return context.nodeModel
              .getAllNodes(
                { type: 'DocpocalypseExample' },
                { path: context.path, connectionType: 'DocpocalypseExample' }
              )
              .find(
                example =>
                  example.fileName === source.name ||
                  example.fileName === source.fileName
              );
          }
        },
        description: metadataType('ComponentDescription'),
        // description: {
        //   type: 'DocpocalypseDescription',
        //   resolve: (src, _, ctx) => {
        //     const { metadataId } = src.fields;
        //     return metadataId ? resolveDescriptionFromMetadata(src, ctx) : null;
        //   }
        // },
        props: metadataType('[ComponentProp]'),
        composes: metadataType('[ComponentComposes]'),
        signatures: {
          type: '[DocumentationJs]!',
          resolve: (src, _, ctx) => {
            return getNodeById(src, 'fields.docJsIds', ctx) || [];
          }
        },
        tags: {
          type: '[DocpocalypseTag]!',
          resolve: (src, _, ctx) => {
            switch (src.type) {
              case 'component': {
                const node = getNodeById(src, 'fields.metadataId', ctx);
                return !node ? [] : node.tags;
              }
              case 'hook': {
                const tags = resolveNodePath(src, 'fields.docJsIds.tags', ctx);

                return (tags || []).map(({ title, description }) => ({
                  name: title,
                  value: description
                }));
              }
              default:
                return [];
            }
          }
        }
      }
    })
  ]);
};

async function createDocpocalypseNode(
  { node, getNode, getNodesByType, actions, createNodeId, createContentDigest },
  pluginOptions
) {
  const { getImportName, ignore } = pluginOptions;
  const { createNode, createNodeField } = actions;
  const isComp = isComponent(node);

  const type = isComp ? 'component' : 'hook';
  const srcFile = getNode(node.parent);

  if (!srcFile || !srcFile.sourceInstanceName.match(/^@docs::source/)) {
    return;
  }

  function createBaseNode() {
    const displayName = isComp ? node.displayName : node.name;
    const name = displayName || srcFile.name;
    const nodeType = 'Docpocalypse';

    let currentNode = getNodesByType(nodeType).find(
      n => n.name === name && n.absolutePath === srcFile.absolutePath
    );

    if (!currentNode) {
      let pkgJson = findPkg.sync(srcFile.dir);

      const rootDir = pkgJson && path.dirname(pkgJson);

      pkgJson = pkgJson && require(pkgJson);

      currentNode = {
        type,
        name,
        rootDir,
        parent: srcFile.id,
        fileName: srcFile.name,
        absolutePath: srcFile.absolutePath,
        id: createNodeId(`${srcFile.absolutePath}-${name}`),
        children: [node.id, srcFile.id],
        package: pkgJson,
        packageName: pkgJson && pkgJson.name,
        file___NODE: srcFile.id,
        internal: {
          contentDigest: createContentDigest(`${node.id}-${name}`),
          type: nodeType
        }
      };

      currentNode.importName = getImportName
        ? getImportName(currentNode, srcFile)
        : '';

      if (ignore && ignore(currentNode)) {
        return null;
      }

      createNode(currentNode);
    }

    return currentNode;
  }

  function addComponentFields(docNode) {
    createNodeField({
      node: docNode,
      name: 'metadataId',
      value: node.id
    });
  }

  function addHookFields(docNode) {
    const others = (docNode.fields && docNode.fields.docJsIds) || [];
    createNodeField({
      node: docNode,
      name: 'docJsIds',
      value: [...others, node.id]
    });
  }

  const baseNode = await createBaseNode();

  if (!baseNode) return;
  switch (baseNode.type) {
    case 'component':
      addComponentFields(baseNode);
      return;
    case 'hook':
      addHookFields(baseNode);
      return;
    default:
      throw new Error('this is weird');
  }
}

function createExampleNode({ node, actions, getNode, createNodeId }) {
  const { createNode } = actions;
  const srcFile = getNode(node.parent);

  createNode({
    parent: node.id,
    id: createNodeId(`${srcFile.absolutePath}-example`),
    fileName: srcFile.name,
    absolutePath: srcFile.absolutePath,
    internal: {
      type: 'DocpocalypseExample',
      contentDigest: node.internal.contentDigest
    }
  });
}

exports.onCreateNode = async function onCreateNode(api, pluginOptions) {
  const { node, getNode } = api;

  if (node.internal.type === 'Mdx') {
    const parentFile = node.parent && getNode(node.parent);

    if (parentFile && parentFile.sourceInstanceName === '@docs::examples') {
      createExampleNode(api, pluginOptions);
    }

    return;
  }

  if (isHook(node) || isComponent(node)) {
    await createDocpocalypseNode(api, pluginOptions);
    // return;
  }
};
