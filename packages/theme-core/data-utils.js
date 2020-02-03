// const { getNamedType, getNullableType } = require('gatsby/graphql');
// const get = require('lodash/get');

// const resolveWithType = async (obj, args, ctx, info) => {
//   const fieldValue = await ctx.defaultFieldResolver(obj, args, ctx, info);
//   const type = getNamedType(getNullableType(info.returnType));
//   return [fieldValue, type];
// };

// const defaultLinkResolver = ([fieldValue, type], ctx) =>
//   Array.isArray(fieldValue)
//     ? ctx.nodeModel.getNodesByIds({ ids: fieldValue, type }, { path: ctx.path })
//     : ctx.nodeModel.getNodeById({ id: fieldValue, type }, { path: ctx.path });

// function link(resolver = defaultLinkResolver) {
//   return async (obj, args, context, info) => {
//     // console.log('link!', obj);
//     return resolver(await resolveWithType(obj, args, context, info), context);
//   };
// }

// function getNodeById(src, idPath, { nodeModel, path }) {
//   const ids = get(src, idPath);
//   if (!ids) return null;

//   return Array.isArray(ids)
//     ? nodeModel.getNodesByIds({ ids }, { path })
//     : nodeModel.getNodeById({ id: ids }, { path });
// }

// function passThroughResolver({ type, fieldName, parentId = 'parent' }) {
//   return (src, args, ctx, info) => {
//     async function resolve(node) {
//       fieldName = fieldName || info.fieldName;

//       const resolver = info.schema.getType(type).getFields()[fieldName].resolve;
//       const result = await resolver(node, args, ctx, {
//         ...info,
//         fieldName
//       });
//       return result == null ? null : result;
//     }

//     const nodes = getNodeById(src, parentId, ctx);

//     if (nodes === null) return null;

//     return Array.isArray(nodes)
//       ? Promise.all(nodes.map(resolve))
//       : resolve(nodes);
//   };
// }

// function passThroughType(type, parentType) {
//   return {
//     type,
//     resolve: passThroughResolver({ type: parentType })
//   };
// }

// const UUID_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

// function isUUID(str) {
//   return UUID_REGEX.test(str);
// }

// function resolveNodePath(obj, path, ctx) {
//   const parts = path.split('.');

//   const resolveId = id => {
//     if (typeof id === 'string' && isUUID(id)) {
//       return ctx.nodeModel.getNodeById({ id });
//     }
//     return id;
//   };

//   while (parts.length) {
//     const part = parts.shift();

//     obj = Array.isArray(obj)
//       ? obj.flatMap(o => resolveId(o)[part])
//       : resolveId(obj)[part];
//   }

//   return obj;
// }

// /**
//  * Proxies all the fields of the current type to another node's type. Helpful
//  * for wrapping and exposing a plugin's types without relying on them being there;
//  *
//  * @param {*} idPath path to id of original node
//  */
// function proxyToNode(idPath) {
//   return async (src, _, ctx, info) => {
//     if (!get(src, idPath)) return null;

//     const otherNode = getNodeById(src, idPath, ctx);
//     if (!otherNode) return null;

//     const otherFields = info.schema
//       .getType(otherNode.internal.type)
//       .getFields();

//     const fieldNames = Object.keys(info.returnType.getFields());
//     const result = {};
//     await Promise.all(
//       fieldNames.map(async name => {
//         const other = otherFields[name];
//         const resolver = (other && other.resolve) || ctx.defaultFieldResolver;

//         result[name] = await resolver(otherNode, _, ctx, {
//           ...info,
//           fieldName: name
//         });
//       })
//     );
//     return result;
//   };
// }

// module.exports = {
//   link,
//   getNodeById,
//   proxyToNode,
//   resolveNodePath,
//   passThroughType,
//   passThroughResolver
// };
