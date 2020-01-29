const { getNamedType, getNullableType } = require('gatsby/graphql');

const resolveWithType = async (obj, args, ctx, info) => {
  const fieldValue = await ctx.defaultFieldResolver(obj, args, ctx, info);
  const type = getNamedType(getNullableType(info.returnType));
  return [fieldValue, type];
};

const defaultLinkResolver = ([fieldValue, type], ctx) =>
  Array.isArray(fieldValue)
    ? ctx.nodeModel.getNodesByIds({ ids: fieldValue, type }, { path: ctx.path })
    : ctx.nodeModel.getNodeById({ id: fieldValue, type }, { path: ctx.path });

function link(resolver = defaultLinkResolver) {
  return async (obj, args, context, info) => {
    console.log('link!', obj);
    return resolver(await resolveWithType(obj, args, context, info), context);
  };
}

function passThroughResolver(pType, fieldName) {
  return async (src, args, ctx, info) => {
    const type = info.schema.getType(pType);

    const node = ctx.nodeModel.getNodeById({
      id: src.parent
    });

    fieldName = fieldName || info.fieldName;

    const resolver = type.getFields()[fieldName].resolve;
    const result = await resolver(node, args, ctx, {
      ...info,
      fieldName
    });
    return result;
  };
}

function passThroughType(type, parentType) {
  return {
    type,
    resolve: passThroughResolver(parentType)
  };
}

module.exports = {
  link,
  passThroughType,
  passThroughResolver
};
