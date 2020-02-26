import {
  GraphQLFieldResolver,
  GraphQLNamedType,
  GraphQLObjectType,
  getNamedType,
  getNullableType,
} from 'gatsby/graphql';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  ComposeOutputType,
  ObjectTypeComposerFieldConfig,
} from 'graphql-compose';
import get from 'lodash/get';

export type PageDependencies = { path: string; connectionType?: string };

export type GraphQLResolveInfo = import('gatsby/graphql').GraphQLResolveInfo;

export interface NodeModel {
  getNodeById<T = any>(
    opts: { id: string; type?: GraphQLNamedType | string },
    deps?: PageDependencies,
  ): T | undefined;
  getNodesByIds<T = any>(
    opts: { ids: string[]; type?: GraphQLNamedType | string },
    deps?: PageDependencies,
  ): T[] | undefined;
  runQuery<T>(
    args: {
      query: { filter?: any; sort?: any };
      type?: GraphQLNamedType | string;
      firstOnly?: boolean;
    },
    deps?: PageDependencies,
  ): T | undefined;
}

export type Args = Record<string, any>;

export interface GatsbyResolverContext {
  path: string;
  defaultFieldResolver: GraphQLFieldResolver<unknown, GatsbyResolverContext>;
  nodeModel: NodeModel;
}

const resolveWithType = async (
  obj: unknown,
  args: Args,
  ctx: GatsbyResolverContext,
  info: GraphQLResolveInfo,
) => {
  const fieldValue = await ctx.defaultFieldResolver(obj, args, ctx, info);
  const type = getNamedType(getNullableType(info.returnType));
  return [fieldValue, type] as [any, GraphQLNamedType];
};

const defaultLinkResolver = (
  [fieldValue, type]: [any, GraphQLNamedType],
  ctx: GatsbyResolverContext,
) =>
  Array.isArray(fieldValue)
    ? ctx.nodeModel.getNodesByIds({ ids: fieldValue, type }, { path: ctx.path })
    : ctx.nodeModel.getNodeById({ id: fieldValue, type }, { path: ctx.path });

function link(resolver = defaultLinkResolver) {
  return async (
    obj: unknown,
    args: Args,
    ctx: GatsbyResolverContext,
    info: GraphQLResolveInfo,
  ) => {
    // console.log('link!', obj);
    return resolver(await resolveWithType(obj, args, ctx, info), ctx);
  };
}

function getNodeById<T = any>(
  src: unknown,
  idPath: string,
  { nodeModel, path }: GatsbyResolverContext,
) {
  const ids = get(src, idPath);
  if (!ids) return null;

  return Array.isArray(ids)
    ? nodeModel.getNodesByIds<T>({ ids }, { path })
    : nodeModel.getNodeById<T>({ id: ids }, { path });
}

interface PassThroughOptions {
  type: string;
  fieldName?: string;
  parentId?: string;
}

function passThroughResolver({
  type,
  fieldName,
  parentId = 'parent',
}: PassThroughOptions) {
  return (
    src: unknown,
    args: Args,
    ctx: GatsbyResolverContext,
    info: GraphQLResolveInfo,
  ) => {
    async function resolve(node: unknown) {
      fieldName = fieldName || info.fieldName;

      const gqlType = info.schema.getType(type) as GraphQLObjectType;
      const resolver = gqlType.getFields()[fieldName].resolve;
      const result = await resolver?.(node, args, ctx, {
        ...info,
        fieldName,
      });
      return result == null ? null : result;
    }

    const nodes = getNodeById(src, parentId, ctx);

    if (nodes === null) return null;

    return Array.isArray(nodes)
      ? Promise.all(nodes.map(resolve))
      : resolve(nodes);
  };
}

function passThroughType(
  type: ComposeOutputType<any>,
  parentType: string,
): ObjectTypeComposerFieldConfig<any, any> {
  return {
    type,
    resolve: passThroughResolver({ type: parentType }),
  };
}

const UUID_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

function isUUID(str: string) {
  return UUID_REGEX.test(str);
}

function resolveNodePath(
  obj: unknown,
  path: string,
  ctx: GatsbyResolverContext,
) {
  const parts = path.split('.');
  let isStalePath = false;

  const resolveId = (id: unknown) => {
    if (typeof id === 'string' && isUUID(id)) {
      const node = ctx.nodeModel.getNodeById({ id });
      if (!node) isStalePath = true;
      return node;
    }
    return id;
  };

  while (parts.length && !isStalePath) {
    const part = parts.shift()!;

    obj = Array.isArray(obj)
      ? obj.flatMap(o => resolveId(o)?.[part] ?? null)
      : resolveId(obj)?.[part] ?? null;
  }

  return obj;
}

/**
 * Proxies all the fields of the current type to another node's type. Helpful
 * for wrapping and exposing a plugin's types without relying on them being there;
 *
 * @param {*} idPath path to id of original node
 */
function proxyToNode(idPath: string) {
  return async (
    src: unknown,
    _: Args,
    ctx: GatsbyResolverContext,
    info: GraphQLResolveInfo,
  ) => {
    if (!get(src, idPath)) return null;

    const otherNode = getNodeById(src, idPath, ctx);
    if (!otherNode) return null;

    const otherFields = (info.schema.getType(
      otherNode.internal.type,
    ) as GraphQLObjectType).getFields();

    const fieldConfig = (info.returnType as GraphQLObjectType).getFields();

    const result: Record<string, any> = { ...otherNode };

    await Promise.all(
      Object.keys(fieldConfig).map(async name => {
        // if there is no matching field then don't do anything and let the current
        // types resolver handle it later
        if (!otherFields[name]) return;

        const resolver = otherFields[name]?.resolve || ctx.defaultFieldResolver;

        result[name] = await resolver(otherNode, _, ctx, {
          ...info,
          fieldName: name,
        });
      }),
    );
    return result;
  };
}

export {
  link,
  getNodeById,
  proxyToNode,
  resolveNodePath,
  passThroughType,
  passThroughResolver,
};
