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

export interface DocCommentNode {
  id: string;
  text?: string;
  shortText?: string;
  tags?: string;
}

function map<T, K>(items: T[] | T, fn: (item: T) => K): K | K[] {
  return Array.isArray(items) ? items.map(fn) : fn(items);
}

const alwaysExclude = [
  'internal',
  'children',
  'sources',
  'childrenTypedocNode',
  'childrenTypedocCommentValue'
];

const nodeTypes = [
  'TypedocNode',
  'TypedocType',
  'TypedocComment',
  'TypedocCommentValue',
  'TypedocMarkdownRemark',
  'TypedocMdx'
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

  const types: GraphQLObjectType[] = nodeTypes.map(type =>
    info.schema.getType(type)
  );

  const fields = types
    .flatMap(type => Object.entries(type.getFields()))
    .map(
      ([key, config]: [string, any]) =>
        [key, getNamedType(config.type).name] as const
    )
    .filter(c => exclude.indexOf(c[0]) === -1 && nodeTypes.indexOf(c[1]) > -1)
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

  const visitTypeDoc = visit((ret: any, node: DocNode) => {
    fields.forEach(field => {
      if (ret[field] == null) return;
      ret[field] = map(getNodeById(node, field, ctx), visitTypeDoc);
    });
  });

  return visitTypeDoc(root);
}
