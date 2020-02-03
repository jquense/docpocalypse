/* eslint-disable @typescript-eslint/no-use-before-define */
import { GraphQLObjectType, getNamedType } from 'gatsby/graphql';
import {
  GatsbyResolverContext,
  GraphQLResolveInfo,
  getNodeById
} from '@docpocalypse/gatsby-data-utils';
import { JSONOutput } from './types';

export type DocNode =
  | JSONOutput.SignatureReflection
  | JSONOutput.ParameterReflection
  | JSONOutput.DeclarationReflection
  | JSONOutput.TypeParameterReflection
  | JSONOutput.ProjectReflection
  | JSONOutput.ContainerReflection;

function map<T, K>(items: T[] | T, fn: (item: T) => K): K | K[] {
  return Array.isArray(items) ? items.map(fn) : fn(items);
}

const alwaysExclude = [
  'internal',
  'children',
  'sources',
  'childrenTypedocNode'
];

export default function resolveNodes(
  root: DocNode,
  args: { exclude?: string[]; include?: string[] } = {},
  ctx: GatsbyResolverContext,
  info: GraphQLResolveInfo
) {
  const exclude = [...alwaysExclude, ...(args.exclude || [])].filter(
    i => !args.include || !args.include.includes(i)
  );

  const seen = new Set();

  const gqlNodeType = info.schema.getType('TypedocNode')! as GraphQLObjectType;
  const gqlTypeType = info.schema.getType('TypedocType')! as GraphQLObjectType;

  const typedocFields = Object.entries(gqlNodeType.getFields())
    .map(([key, config]) => [key, getNamedType(config.type).name] as const)
    .filter(c => exclude.indexOf(c[0]) === -1);

  const typeFields = Object.entries(gqlTypeType.getFields())
    .map(([key, config]) => [key, getNamedType(config.type).name] as const)
    .filter(c => exclude.indexOf(c[0]) === -1);

  // linked fields on TypedocNode types
  const typedocTypeFields = typedocFields
    .filter(c => c[1] === 'TypedocType')
    .map(c => c[0]);

  const typedocNodeFields = typedocFields
    .filter(c => c[1] === 'TypedocNode')
    .map(c => c[0]);

  // linked fields on TypedocType types
  const typeTypeFields = typeFields
    .filter(c => c[1] === 'TypedocType')
    .map(c => c[0]);

  const typeNodeFields = typeFields
    .filter(c => c[1] === 'TypedocNode')
    .map(c => c[0]);

  function visit(fn) {
    return (node: any) => {
      if (!node) return null;

      if (seen.has(node))
        return {
          kind: -1,
          kindString: 'CircularReference',
          id: node.id,
          name: node.name
        };

      const ret = { ...node };
      exclude.forEach(k => {
        delete ret[k];
      });

      seen.add(node);
      fn(ret, node);
      seen.delete(node);
      return ret;
    };
  }

  const visitType = visit((ret: any, node: any) => {
    typeTypeFields.forEach(field => {
      if (ret[field] == null) return;
      ret[field] = map(node[field], visitType);
    });

    typeNodeFields.forEach(field => {
      if (ret[field] == null) return;

      ret[field] = map(getNodeById(node, field, ctx), visitTypeDoc);
    });
  });

  const visitTypeDoc = visit((ret: any, node: DocNode) => {
    typedocNodeFields.forEach(field => {
      if (ret[field] == null) return;

      ret[field] = map(getNodeById(node, field, ctx), visitTypeDoc);
    });

    typedocTypeFields.forEach(field => {
      if (ret[field] == null) return;
      ret[field] = map(node[field], visitType);
    });
  });

  // console.log(exclude, typeFields);
  return visitTypeDoc(root);
}
