/* eslint-disable @typescript-eslint/no-use-before-define */

import fs from 'fs';
import { dirname, join } from 'path';
import { CreateSchemaCustomizationArgs } from 'gatsby';
import {
  Application,
  JSONOutput,
  ProjectReflection,
  TSConfigReader
} from 'typedoc';
import { findConfigFile, readConfigFile, sys } from 'typescript';
import camelCase from 'lodash/camelCase';
import {
  GatsbyResolverContext,
  proxyToNode
} from '@docpocalypse/gatsby-data-utils';
import resolveNodes, { DocNode } from './lib/resolveNode';
import * as T from './lib/types';
import createCommentNode from './lib/createCommentNode';

// class MySourceReferenceContainerSerializer extends SourceReferenceContainerSerializer {
//   toObject(arg: any, obj: any) {
//     console.log('HERE', arg.file, obj);
//     return obj;
//   }
// }

interface GatsbyNode {
  id: string;
}

interface PluginOptions {
  projects: string[];
  [key: string]: any;
}

export function createSchemaCustomization({
  actions,
  schema
}: CreateSchemaCustomizationArgs) {
  actions.createTypes([
    schema.buildEnumType({
      name: 'TypedocNodeKind',
      extensions: ['dontInfer'],
      values: {
        CircularReference: { value: -1 },
        Global: { value: 0 },
        ExternalModule: { value: 1 },
        Module: { value: 2 },
        Enum: { value: 4 },
        EnumMember: { value: 16 },
        Variable: { value: 32 },
        Function: { value: 64 },
        Class: { value: 128 },
        Interface: { value: 256 },
        Constructor: { value: 512 },
        Property: { value: 1024 },
        Method: { value: 2048 },
        CallSignature: { value: 4096 },
        IndexSignature: { value: 8192 },
        ConstructorSignature: { value: 16384 },
        Parameter: { value: 32768 },
        TypeLiteral: { value: 65536 },
        TypeParameter: { value: 131072 },
        Accessor: { value: 262144 },
        GetSignature: { value: 524288 },
        SetSignature: { value: 1048576 },
        ObjectLiteral: { value: 2097152 },
        TypeAlias: { value: 4194304 },
        Event: { value: 8388608 },
        ClassOrInterface: { value: 384 },
        VariableOrProperty: { value: 1056 },
        FunctionOrMethod: { value: 2112 },
        SomeSignature: { value: 1601536 },
        SomeModule: { value: 3 },
        SomeType: { value: 4391168 },
        SomeValue: { value: 2097248 }
      }
    }),
    schema.buildObjectType({
      name: `TypedocMdx`,
      extensions: ['dontInfer'],
      fields: {
        body: 'String!',
        mdxAST: 'JSON'
      }
    }),
    schema.buildObjectType({
      name: `TypedocMarkdownRemark`,
      extensions: ['dontInfer'],
      fields: {
        html: 'String'
      }
    }),
    schema.buildObjectType({
      name: 'TypedocCommentValue',
      interfaces: ['Node'],
      extensions: ['dontInfer'],
      fields: {
        value: 'String',
        markdownRemark: {
          type: 'TypedocMarkdownRemark',
          resolve: proxyToNode('fields.markdownRemark')
        },
        mdx: {
          type: 'TypedocMdx',
          resolve: proxyToNode('fields.mdx')
        }
      }
    }),
    /* GraphQL */ `
      type TypedocFlags @dontInfer {
        isPrivate: Boolean
        isProtected: Boolean
        isPublic: Boolean
        isStatic: Boolean
        isExported: Boolean
        isExternal: Boolean
        isOptional: Boolean
        isRest: Boolean
        hasExportAssignment: Boolean
        isConstructorProperty: Boolean
        isAbstract: Boolean
        isConst: Boolean
        isLet: Boolean
      }

      type TypedocSource @dontInfer {
        fileName: String
        line: Int
        character: Int
      }

      type TypedocTag @dontInfer {
        tag: String
        text: String
      }

      type TypedocComment implements Node @dontInfer {
        text: TypedocCommentValue! @link
        shortText: TypedocCommentValue! @link
        tags: [TypedocTag]
      }

      type TypedocGroup @dontInfer {
        title: String!
        kind: TypedocNodeKind!
        children: [TypedocNode]! @link
      }

      type TypedocNodeRaw implements Node @dontInfer {
        json: JSON!
      }

      type TypedocType @dontInfer {
        type: String!
        name: String
        value: String
        operator: String
        target: TypedocType
        constraint: TypedocType
        elementType: TypedocType

        targetType: TypedocType
        checkType: TypedocType
        extendsType: TypedocType
        trueType: TypedocType
        falseType: TypedocType

        types: [TypedocType]
        elements: [TypedocType]
        typeArguments: [TypedocType]

        reference: TypedocNode @link
        declaration: TypedocNode @link

        sources: [TypedocSource!]!
        groups: [TypedocGroup!]!
      }

      type TypedocNode implements Node @dontInfer {
        rootDir: String
        file: File
        tsconfig: String

        kind: TypedocNodeKind!
        kindString: String
        name: String!
        originalName: String
        defaultValue: String
        flags: TypedocFlags!
        comment: TypedocComment! @link

        signatures: [TypedocNode!] @link
        typedocs: [TypedocNode!] @link
        # childrenTypedocNode: [TypedocNode!] @link

        indexSignature: [TypedocNode!] @link
        typeParameter: [TypedocNode!] @link
        parameters: [TypedocNode!] @link

        type: TypedocType
        overwrites: TypedocType
        inheritedFrom: TypedocType

        extendedTypes: [TypedocType]
        extendedBy: [TypedocType]

        implementationOf: TypedocType
        implementedBy: [TypedocType]
        implementedTypes: [TypedocType]

        sources: [TypedocSource!]!
        groups: [TypedocGroup!]!
      }
    `
    // gatsby type is wrong
  ] as any);
}

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    TypedocNode: {
      file: {
        type: 'File',
        resolve: (src, _, ctx: GatsbyResolverContext) => {
          if (!src.absolutePath) return null;
          return ctx.nodeModel.runQuery({
            query: {
              filter: { absolutePath: { eq: src.absolutePath } }
            },
            firstOnly: true,
            type: 'File'
          });
        }
      },
      resolved: {
        type: 'JSON',
        args: { exclude: '[String]', include: '[String]' },
        resolve: (src, args, ctx, info) => {
          return resolveNodes(src, args, ctx, info);
        }
      }
    }
  });
};

export function sourceNodes(
  { actions, createNodeId, createContentDigest, reporter },
  pluginOptions: PluginOptions
) {
  const { createNode } = actions;
  const nodes = new Map<string, any>();

  const { projects, debugRaw, ...typedocOptions } = pluginOptions;

  const roots = ([] as string[]).concat(projects);

  const getFile = (node: any, project: ProjectReflection) => {
    // console.log(project.getReflectionById(node.id));

    if (node.kind === T.Kind.Global) return node.rootDir;
    if (node.kind === T.Kind.ExternalModule && node.originalName)
      return node.originalName;

    const reflection = project.getReflectionById(node.id);

    return reflection?.sources?.[0]?.file?.fullFileName ?? null;
  };

  roots.forEach((root, idx) => {
    const createId = (id: any) => createNodeId(`TypedocNode:${idx}-${id}`);

    const isFile = fs.statSync(root).isFile();

    const tsconfig = isFile ? root : findConfigFile(root, sys.fileExists);

    if (!tsconfig) {
      reporter.info(
        `No typescript project detected for source ${root} skipping`
      );
      return;
    }
    reporter.info(
      `Typescript config found for source ${root}, generating type information`
    );

    const { config, error } = readConfigFile(tsconfig, sys.readFile);

    if (error) {
      reporter.error(error);
      if (!config) return;
    }

    const app = new Application();
    app.options.addReader(new TSConfigReader());

    app.bootstrap({
      ...typedocOptions,
      mode: 'modules',
      // excludeNotExported: true,
      tsconfig
    });

    // app.serializer.addSerializer(
    //   new MySourceReferenceContainerSerializer(app.serializer)
    // );

    const rootDir = join(
      dirname(tsconfig),
      config.compilerOptions?.rootDir ?? ''
    );

    const project = app.convert(app.expandInputFiles([rootDir]));

    if (!project) {
      reporter.error('There was a problem building your typedoc project');
      return;
    }

    const data = app.serializer.projectToObject(project);

    function findDeclarations(
      type?: JSONOutput.SomeType,
      parent?: string
    ): any {
      const find = (t?: JSONOutput.SomeType) => findDeclarations(t, parent);
      if (!type) return type;

      if (type.type === 'reference' && 'id' in type) {
        (type as any).reference = createId(type.id);
      }

      if ('declaration' in type && type.declaration) {
        type.declaration =
          'name' in type.declaration
            ? traverse(type.declaration, parent).id
            : createId(type.declaration.id);
      }
      if ('target' in type) type.target = find(type.target);
      if ('types' in type) type.types = type.types?.flatMap(find);
      if ('constraint' in type) type.constraint = find(type.constraint);
      if ('elementType' in type) type.elementType = find(type.elementType);
      if ('elements' in type) type.elements = type.elements?.flatMap(find);
      if ('typeArguments' in type)
        type.typeArguments = type.typeArguments?.flatMap(find);

      return type;
    }

    function traverse(docNode: DocNode, parent?: string): GatsbyNode {
      const nodeId = createId(docNode.id);

      if (nodes.has(nodeId)) {
        return { id: nodeId };
      }

      const dnode: any = docNode;
      const typedocs = dnode.children?.map(c => traverse(c, nodeId).id) ?? [];
      const signatures =
        dnode.signatures?.map(c => traverse(c, nodeId).id) ?? [];
      const parameters =
        dnode.parameters?.map(c => traverse(c, nodeId).id) ?? [];

      const typeParameter = dnode.typeParameter
        ? [].concat(dnode.typeParameter).map(tp => traverse(tp, nodeId)?.id)
        : [];

      [
        'type',
        'overwrites',
        'inheritedFrom',
        'extendedTypes',
        'extendedBy',
        'implementedTypes',
        'implementedBy',
        'implementationOf'
      ].forEach(field => {
        (docNode as any)[field] = findDeclarations(
          (docNode as any)[field],
          nodeId
        );
      });

      const node: any = {
        ...docNode,
        parent,
        rootDir,
        tsconfig,
        id: nodeId,
        typedocs,
        signatures,
        parameters,
        typeParameter,
        // childrenTypedocNode: children,
        sources: ('sources' in docNode && docNode.sources) || [],
        groups:
          ('groups' in docNode &&
            docNode.groups?.map(group => ({
              ...group,
              children: group.children?.map(id => createId(id))
            }))) ||
          []
      };

      node.absolutePath = getFile(docNode, project!);

      node.internal = {
        type: 'TypedocNode',
        contentDigest: createContentDigest(JSON.stringify(node))
      };

      node.children = node.typedocs
        .concat(signatures, parameters, typeParameter)
        .filter(Boolean);

      nodes.set(nodeId, docNode);

      if ('comment' in node) {
        createCommentNode(
          node,
          node.comment,
          actions,
          createNodeId,
          createContentDigest
        );
      }

      createNode(node);
      return node;
    }

    if (data) {
      // console.log(project.getReflectionById(data.children![0]!.id!));
      traverse(data);
      nodes.clear();

      if (debugRaw) {
        createNode({
          root,
          id: createNodeId(`typedoc-${data.name || 'default'}`),
          json: data,
          internal: {
            type: 'TypedocNodeRaw',
            contentDigest: createContentDigest(JSON.stringify(data))
          }
        });
      }
    } else {
      reporter.error('Failed to generate TypeDoc');
    }
  });
}

export function onCreateNode({ node, actions, getNode }) {
  const { createNodeField } = actions;

  const parentNode = node.parent && getNode(node.parent);

  if (parentNode && parentNode.internal.type === 'TypedocCommentValue') {
    const { type } = node.internal;

    if (type === 'Mdx' || type === 'MarkdownRemark') {
      createNodeField({
        node: parentNode,
        name: camelCase(type),
        value: node.id
      });
    }
  }
}
