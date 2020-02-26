const {
  resolveNodePath,
  getNodeById,
  passThroughResolver
} = require('@docpocalypse/gatsby-data-utils');

const Metadata = require('./dataModel/Metadata');
const DocumentationJs = require('./dataModel/DocumentationJs');
const createExampleNode = require('./dataModel/createExampleNode');
const createDocpocalypseNode = require('./dataModel/createDocpocalypseNode');

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

const typedocType = (type, fieldName) => ({
  type,
  resolve: passThroughResolver({
    fieldName,
    type: 'TypedocNode',
    parentId: 'fields.typedocId'
  })
});

const byFields = (obj, defaultValue = null) => {
  return (src, ...args) => {
    for (const [field, resolver] of Object.entries(obj)) {
      if (src.fields[field]) return resolver(src, ...args);
    }

    return defaultValue;
  };
};
// const { Kind } = require('gatsby-plugin-typedoc/types');
const parseCodeBlocks = require('./parse-code-blocks');

exports.createResolvers = (...args) => {
  Metadata.createResolvers(...args);
  DocumentationJs.createResolvers(...args);
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
    `,
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
        type: 'String!',
        name: 'String!',
        fileName: 'String!',
        absolutePath: 'String!',
        rootDir: 'String',
        package: 'JSON',
        packageName: 'String',
        importName: 'String',
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
        props: metadataType('[ComponentProp]'),
        composes: metadataType('[ComponentComposes]'),
        tsType: typedocType('JSON', 'resolved'),
        signatures: {
          type: '[DocumentationJs]!',
          resolve: (src, _, ctx) =>
            getNodeById(src, 'fields.docJsIds', ctx) || []
        },
        tags: {
          type: '[DocpocalypseTag]!',
          resolve: byFields(
            {
              metadataId: (src, _, ctx) =>
                resolveNodePath(src, 'fields.metadataId.tags', ctx) || [],

              docJsIds: (src, _, ctx) => {
                const tags = resolveNodePath(src, 'fields.docJsIds.tags', ctx);

                return (tags || [])
                  .filter(Boolean)
                  .map(({ title, description }) => ({
                    name: title,
                    value: description
                  }));
              }
            },
            []
          )
        }
      }
    })
  ]);
};

exports.onCreateNode = async function onCreateNode(api, pluginOptions) {
  if (createExampleNode.canCreate(api)) {
    await createExampleNode(api, pluginOptions);
  } //
  else if (createDocpocalypseNode.canCreate(api)) {
    await createDocpocalypseNode(api, pluginOptions);
  }
};
