/* eslint-disable @typescript-eslint/no-use-before-define */

import fs from 'fs';
import path from 'path';
import { getNamedType, getNullableType } from 'gatsby/graphql';
import upperFirst from 'lodash/upperFirst';
import { Application } from 'typedoc';
import { findConfigFile, readConfigFile, sys } from 'typescript';
import * as T from './types';

interface GatsbyNode {
  id: string;
}

type DocNode =
  | T.SignatureReflection
  | T.ParameterReflection
  | T.DeclarationReflection
  | T.TypeParameterReflection
  | T.ProjectReflection
  | T.ContainerReflection;

interface PluginOptions {
  projects: string[];
  [key: string]: any;
}

const resolveWithType = async (obj, args, ctx, info) => {
  const fieldValue = await ctx.defaultFieldResolver(obj, args, ctx, info);
  const type = getNamedType(getNullableType(info.returnType));
  return [fieldValue, type];
};

const defaultLinkResolver = <T>([fieldValue, type]: [T | T[], string], ctx) =>
  Array.isArray(fieldValue)
    ? ctx.nodeModel.getNodesByIds({ ids: fieldValue, type }, { path: ctx.path })
    : ctx.nodeModel.getNodeById({ id: fieldValue, type }, { path: ctx.path });

const link = (resolver: Function = defaultLinkResolver) => async (
  obj,
  args,
  context,
  info
) => {
  return resolver(await resolveWithType(obj, args, context, info), context);
};

export function createSchemaCustomization({ actions, createNodeId, schema }) {
  const { createTypes } = actions;

  const typeResolver = ([value, type], context) => {
    if (!value) return null;

    if (Array.isArray(value)) {
      return Promise.all(value?.map(v => typeResolver([v, type], context)));
    }

    if (value.type === 'reference') {
      const id = value.id ?? value.declaration?.id;

      if (id) {
        const node = context.nodeModel.getNodeById(
          {
            id: createNodeId(`TypedocNode:${id}`),
            type: 'TypedocNode'
          },
          { path: context.path }
        );
        // console.log(type.type, node);
        return node;
      }
    }

    return value;
  };

  const typeField = {
    type: 'TypedocType!',
    resolve: link(typeResolver)
  };
  const nullableTypeField = {
    type: 'TypedocType',
    resolve: link(typeResolver)
  };
  const typeArrayField = {
    type: '[TypedocType!]!',
    resolve: link(typeResolver)
  };
  const nullableTypeArrayField = {
    type: '[TypedocType!]',
    resolve: link(typeResolver)
  };

  createTypes([
    schema.buildEnumType({
      name: 'TypedocNodeKind',
      extensions: ['dontInfer'],
      values: {
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

      type TypedocGroup @dontInfer {
        title: String!
        kind: TypedocNodeKind!
        children: [TypedocNode]! @link
      }

      # type TypedocNode implements Node @dontInfer {
      #   kind: TypedocNodeKind!
      #   kindString: String
      # }

      type TypedocNodeRaw implements Node @dontInfer {
        json: JSON!
      }
    `,
    schema.buildObjectType({
      name: 'TypedocArrayType',
      fields: {
        type: 'String!',
        elementType: typeField
      }
    }),
    schema.buildObjectType({
      name: 'TypedocUnionOrIntersectionType',
      fields: {
        type: 'String!',
        types: typeArrayField
      }
    }),
    schema.buildObjectType({
      name: 'TypedocIntrinsicType',
      fields: {
        type: 'String!',
        name: 'String!'
      }
    }),
    schema.buildObjectType({
      name: 'TypedocIntrinsicType',
      fields: {
        type: 'String!',
        name: 'String!'
      }
    }),
    schema.buildObjectType({
      name: 'TypedocReferenceType',
      fields: {
        type: 'String!',
        name: 'String!',
        typeArguments: typeArrayField
      }
    }),
    schema.buildObjectType({
      name: 'TypedocReflectionType',
      fields: {
        type: 'String!',
        declaration: {
          type: 'TypedocNode',
          resolve: ({ declaration }, _, context) => {
            if (!declaration) return null;

            const node = context.nodeModel.getNodeById(
              {
                id: createNodeId(`TypedocNode:${declaration.id}`),
                type: 'TypedocNode'
              },
              { path: context.path }
            );
            return node;
          }
        }
      }
    }),
    schema.buildObjectType({
      name: 'TypedocStringLiteralType',
      fields: {
        type: 'String!',
        value: 'String!'
      }
    }),
    schema.buildObjectType({
      name: 'TypedocTupleType',
      fields: {
        type: 'String!',
        elements: typeArrayField
      }
    }),
    schema.buildObjectType({
      name: 'TypedocTypeOperatorType',
      fields: {
        type: 'String!',
        operator: 'String!',
        target: typeField
      }
    }),
    schema.buildObjectType({
      name: 'TypedocTypeParameterType',
      fields: {
        type: 'String!',
        name: 'String!',
        constraint: typeField
      }
    }),
    schema.buildObjectType({
      name: 'TypedocUnknownType',
      fields: {
        type: 'String!',
        name: 'String!'
      }
    }),
    schema.buildUnionType({
      name: 'TypedocType',
      types: [
        'TypedocArrayType',
        'TypedocUnionOrIntersectionType',
        'TypedocIntrinsicType',
        'TypedocReferenceType',
        'TypedocReflectionType',
        'TypedocStringLiteralType',
        'TypedocTupleType',
        'TypedocTypeOperatorType',
        'TypedocTypeParameterType',
        'TypedocUnknownType',
        'TypedocNode'
      ],
      resolveType(src) {
        switch (src.type) {
          case 'reference': {
            if (src.id) return 'TypedocNode';
            return 'TypedocReferenceType';
          }
          case 'intersection':
          case 'union':
            return 'TypedocUnionOrIntersectionType';
          default:
            console.log(
              'TYPE:  ',
              `Typedoc${upperFirst(src.type)}Type`,
              '\n\n',
              src,
              '\n\n'
            );
            return src.internal?.type ?? `Typedoc${upperFirst(src.type)}Type`;
        }
      }
    }),
    schema.buildObjectType({
      name: 'TypedocNode',
      interfaces: ['Node'],
      extensions: ['donInfer'],
      fields: {
        kind: 'TypedocNodeKind!',
        kindString: 'String',
        name: 'String!',
        originalName: 'String',
        flags: 'TypedocFlags!',
        signatures: {
          type: '[TypedocNode!]',
          resolve: link()
        },
        typedocs: {
          type: '[TypedocNode!]',
          resolve: link()
        },
        childrenTypedocNode: {
          type: '[TypedocNode!]',
          resolve: link()
        },
        sources: '[TypedocSource!]!',
        groups: '[TypedocGroup!]!',

        type: nullableTypeField,
        typeParameter: {
          type: '[TypedocNode!]!',
          resolve: link()
        },
        parameters: {
          type: '[TypedocNode!]',
          resolve: link()
        },

        defaultValue: 'String',
        overwrites: nullableTypeField,
        inheritedFrom: nullableTypeField,

        extendedTypes: nullableTypeArrayField,
        extendedBy: nullableTypeArrayField,

        implementationOf: nullableTypeField,
        implementedBy: nullableTypeArrayField,
        implementedTypes: nullableTypeArrayField
      }
    })
  ]);
}

function canParse(node) {
  return (
    node &&
    // TypeScript doesn't really have a mime type and .ts files are a media file :/
    (node.internal.mediaType === `application/typescript` ||
      node.internal.mediaType === `text/tsx` ||
      node.extension === `tsx` ||
      node.extension === `ts`)
  );
}

// export function onCreateNode({
//   node,
//   actions,
//   createNodeId,
//   createContentDigest,
//   reporter
// }) {
//   if (node.type === 'File') console.log(node);
//   if (node.internal.type !== 'File' || !canParse(node)) {
//     return;
//   }

//   const src = node.absolutePath;

//   const tsconfig = findConfigFile(src, sys.fileExists);
//   const { config, error } = readConfigFile(tsconfig!, sys.readFile);
//   reporter.info(tsconfig!, src);

//   if (error) {
//     reporter.error(error);
//     if (!config) return;
//   }

//   const app = new Application({
//     // ...pluginOptions,
//     mode: 'modules',
//     // excludeNotExported: true,
//     tsconfig
//   });

//   const project = app.convert([src]);

//   if (!project) {
//     reporter.error('There was a problem building your typedoc project');
//     return;
//   }

//   const data = app.serializer.projectToObject(project);

//   const nodeId = createNodeId(`typedoc-${data.name || 'default'}`);
//   const nodeContent = JSON.stringify(data);

//   const nodeData = {
//     id: nodeId,
//     json: data,
//     internal: {
//       type: 'TypedocNodeRaw',
//       content: nodeContent,
//       contentDigest: createContentDigest(data)
//     }
//   };

//   actions.createNode(nodeData);
// }

export function sourceNodes(
  { actions, createNodeId, createContentDigest, reporter },
  pluginOptions: PluginOptions
) {
  const { createNode } = actions;

  const createId = id => createNodeId(`TypedocNode:${id}`);

  function processTypeDocRaw(generated) {
    const nodeId = createNodeId(`typedoc-${generated.name || 'default'}`);
    const nodeContent = JSON.stringify(generated);

    const nodeData = {
      id: nodeId,
      json: generated,
      internal: {
        type: 'TypedocNodeRaw',
        content: nodeContent,
        contentDigest: createContentDigest(generated)
      }
    };

    return nodeData;
  }

  const nodes = new Set();

  function findDeclarations(type?: T.SomeType, parent?: string): string[] {
    const find = (t?: T.SomeType) => findDeclarations(t, parent);
    if (type) {
      if ('declaration' in type && type.declaration) {
        if (Array.isArray(type.declaration))
          console.log('HERE', type.declaration);
        return [
          // pointer
          !('name' in type.declaration)
            ? createId(type.declaration.id)
            : traverse(type.declaration, parent).id
        ];
      }
      if ('elementType' in type) return find(type.elementType);
      if ('constraint' in type) return find(type.constraint);
      if ('target' in type) return find(type.target);

      if ('types' in type) return type.types?.flatMap(find) || [];
      if ('elements' in type) return type.elements?.flatMap(find) || [];
      if ('typeArguments' in type)
        return type.typeArguments?.flatMap(find) || [];
    }
    return [];
  }

  function traverse(docNode: DocNode, parent?: string): GatsbyNode {
    const nodeId = createId(docNode.id);

    if (nodes.has(docNode.id)) {
      return { id: nodeId };
    }

    const dnode: any = docNode;
    const typedocs = dnode.children?.map(c => traverse(c, nodeId).id) ?? [];
    const signatures = dnode.signatures?.map(c => traverse(c, nodeId).id) ?? [];
    const parameters = dnode.parameters?.map(c => traverse(c, nodeId).id) ?? [];

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
    ].forEach(field => findDeclarations((docNode as any)[field], nodeId));

    // if (!docNode.kindString) console.log(docNode, parent);

    const node: any = {
      ...docNode,
      parent,
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

    node.internal = {
      type: 'TypedocNode',
      contentDigest: createContentDigest(JSON.stringify(node))
    };

    node.children = node.typedocs
      .concat(signatures, parameters, typeParameter)
      .filter(Boolean);

    nodes.add(docNode.id);
    createNode(node);
    return node;
  }

  const { projects, ...typedocOptions } = pluginOptions;

  const roots = ([] as string[]).concat(projects);

  roots.forEach(root => {
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

    const app = new Application({
      ...typedocOptions,
      mode: 'modules',
      // excludeNotExported: true,
      tsconfig
    });

    const rootDir = path.join(
      path.dirname(tsconfig),
      config.compilerOptions?.rootDir ?? ''
    );

    const project = app.convert(app.expandInputFiles([rootDir]));

    if (!project) {
      reporter.error('There was a problem building your typedoc project');
      return;
    }

    const data = app.serializer.projectToObject(project);

    // console.log(data);

    if (data) {
      traverse(data);
      nodes.clear();
      createNode(processTypeDocRaw(data));
    } else {
      reporter.error('Failed to generate TypeDoc');
    }
  });
}
