/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  GatsbyResolverContext,
  GraphQLResolveInfo,
  getNodeById,
} from '@docpocalypse/gatsby-data-utils';
import { GraphQLObjectType, getNamedType } from 'gatsby/graphql';

import { JSONOutput } from './types';

export type DocNode =
  | JSONOutput.SignatureReflection
  | JSONOutput.ParameterReflection
  | JSONOutput.DeclarationReflection
  | JSONOutput.TypeParameterReflection
  | JSONOutput.ProjectReflection
  | JSONOutput.ContainerReflection;

function map<T, K>(
  items: T[] | T,
  fn: (item: T) => Promise<K>,
): Promise<K | K[]> {
  return Array.isArray(items) ? Promise.all(items.map(fn)) : fn(items);
}

const alwaysExclude = [
  'internal',
  'children',
  'sources',
  'childrenTypedocNode',
  'childrenTypedocCommentValue',
];

function resolve(
  node: any,
  type: string,
  fieldName: string,
  ctx: GatsbyResolverContext,
  info: GraphQLResolveInfo,
) {
  const gqlType = info.schema.getType(type)! as GraphQLObjectType;

  const resolver =
    gqlType.getFields()[fieldName].resolve || ctx.defaultFieldResolver;
  return resolver(node, {}, ctx, {
    ...info,
    fieldName: 'body',
  });
}

export default function resolveNodes(
  root: DocNode,
  args: { exclude?: string[]; include?: string[] } = {},
  ctx: GatsbyResolverContext,
  info: GraphQLResolveInfo,
) {
  const exclude = [...alwaysExclude, ...(args.exclude || [])].filter(
    (i) => !args.include || !args.include.includes(i),
  );

  const seen = new Set();

  const gqlNodeType = info.schema.getType('TypedocNode')! as GraphQLObjectType;
  const gqlTypeType = info.schema.getType('TypedocType')! as GraphQLObjectType;

  const typedocFields = Object.entries(gqlNodeType.getFields())
    .map(([key, config]) => [key, getNamedType(config.type).name] as const)
    .filter((c) => exclude.indexOf(c[0]) === -1);

  const typeFields = Object.entries(gqlTypeType.getFields())
    .map(([key, config]) => [key, getNamedType(config.type).name] as const)
    .filter((c) => exclude.indexOf(c[0]) === -1);

  // linked fields on TypedocNode types
  const typedocTypeFields = typedocFields
    .filter((c) => c[1] === 'TypedocType')
    .map((c) => c[0]);

  const typedocNodeFields = typedocFields
    .filter((c) => c[1] === 'TypedocNode')
    .map((c) => c[0]);

  const typedocCommentFields = typedocFields
    .filter((c) => c[1] === 'TypedocCommentText')
    .map((c) => c[0]);

  // linked fields on TypedocType types
  const typeTypeFields = typeFields
    .filter((c) => c[1] === 'TypedocType')
    .map((c) => c[0]);

  const typeNodeFields = typeFields
    .filter((c) => c[1] === 'TypedocNode')
    .map((c) => c[0]);

  function visit(fn) {
    return async (node: any) => {
      if (!node) return null;

      if (seen.has(node))
        return {
          kind: -1,
          kindString: 'CircularReference',
          id: node.id,
          name: node.name,
        };

      const ret = { ...node };
      exclude.forEach((k) => {
        delete ret[k];
      });

      seen.add(node);
      await fn(ret, node);
      seen.delete(node);
      return ret;
    };
  }

  const visitMdx = visit(async (ret: any, node: any) => {
    ret.body = await resolve(node, 'Mdx', 'body', ctx, info);
  });

  const visitMdRemark = visit(async (ret: any, node: any) => {
    ret.html = await resolve(node, 'MarkdownRemark', 'html', ctx, info);
  });

  const visitComment = visit(async (ret: any, node: any) => {
    ret.mdx = await visitMdx(getNodeById(node.fields, 'mdx', ctx));
    ret.markdownRemark = await visitMdRemark(
      getNodeById(node.fields, 'markdownRemark', ctx),
    );
    delete ret.fields;
  });

  const visitType = visit(async (ret: any, node: any) => {
    await Promise.all(
      typeTypeFields.map(async (field) => {
        if (ret[field] != null) {
          ret[field] = await map(node[field], visitType);
        }

        return ret[field];
      }),
    );

    await Promise.all(
      typeNodeFields.map(async (field) => {
        if (ret[field] != null) {
          ret[field] = await map(getNodeById(node, field, ctx), visitTypeDoc);
        }

        return ret[field];
      }),
    );
  });

  const visitTypeDoc = visit(async (ret: any, node: DocNode) => {
    await Promise.all(
      typedocNodeFields.map(async (field) => {
        if (ret[field] != null) {
          ret[field] = await map(getNodeById(node, field, ctx), visitTypeDoc);
        }

        return ret[field];
      }),
    );

    await Promise.all(
      typedocTypeFields.map(async (field) => {
        if (ret[field] != null) {
          ret[field] = await map(node[field], visitType);
        }

        return ret[field];
      }),
    );

    await Promise.all(
      typedocCommentFields.map(async (field) => {
        if (ret[field] != null) {
          ret[field] = await visitComment(getNodeById(node, field, ctx));
        }
      }),
    );
  });

  return visitTypeDoc(root);
}
