import { Kind, TypedocNode, TypedocType } from '../typedoc-types';

export const getLinkedNode = (def?: TypedocNode) => {
  if (def?.type) {
    if (def.type.type === 'reflection') return def.type.declaration;
    if (def.type.type === 'reference') return def.type.reference;
  }
  return undefined;
};

export const isInternalType = (node: TypedocNode) => node.name.startsWith('__');

export const isObjecty = (node: TypedocNode) =>
  node.kind === Kind.Interface ||
  node.kind === Kind.ObjectLiteral ||
  (node.kind === Kind.TypeLiteral && !!node.typedocs?.length);

export const getReadableName = (node: TypedocNode) => {
  // grumble
  if (node.name === '__namedParameters') return 'Destructured Object';
  return isInternalType(node) ? node.originalName : node.name;
};

export const getFunctionNode = (
  definition?: TypedocNode,
): false | TypedocNode => {
  if (!definition) return false;
  if (
    definition.kind === Kind.CallSignature ||
    definition.parameters?.length ||
    definition.signatures?.length
  )
    return definition;

  return getFunctionNode(getLinkedNode(definition));
};

const isType = (node: TypedocType | TypedocNode): node is TypedocType =>
  typeof node.type === 'string';

export default function typeExpression(
  type: TypedocType | TypedocNode,
  opts: { compact?: boolean } = {},
) {
  if (!type) return null;

  if (isType(type)) {
    if (
      type.type === 'intrinsic' ||
      type.type === 'typeParameter' ||
      type.type === 'unknown'
    ) {
      return type.name;
    }

    if (type.type === 'array') {
      return type.elementType
        ? `${typeExpression(type.elementType, opts)}[]`
        : 'Array';
    }

    if (type.type === 'conditional') {
      return `${typeExpression(type.checkType, opts)} extends ${typeExpression(
        type.checkType,
        opts,
      )} ? ${typeExpression(type.trueType, opts)} : ${typeExpression(
        type.falseType,
        opts,
      )}`;
    }

    if (type.type === 'indexedAccess') {
      return `${typeExpression(type.objectType, opts)}[${typeExpression(
        type.indexType,
        opts,
      )}]`;
    }

    if (type.type === 'inferred') {
      return `infer ${type.name}`;
    }

    if (type.type === 'intersection') {
      return type.types.map(tt => typeExpression(tt, opts)).join(' & ');
    }

    if (type.type === 'predicate') {
      return `${type.asserts ? 'asserts ' : ''}${type.name}${
        type.targetType ? typeExpression(type.targetType, opts) : ''
      }`;
    }

    if (type.type === 'query') {
      return `typeof ${typeExpression(type.queryType, opts)}`;
    }

    if (type.type === 'reference') {
      const typeArgs =
        type.typeArguments?.length &&
        `<${type.typeArguments!.map(t => typeExpression(t, opts)).join(', ')}>`;

      // TypeDoc doesn't always type functions correctly
      if (!type.reference && type.name === '(Anonymous function)') {
        return 'function';
      }
      return `${type.reference?.name ?? type.name}${typeArgs ?? ''}`;
    }

    if (type.type === 'reflection') {
      return typeExpression(type.declaration, opts);
    }

    if (type.type === 'stringLiteral') {
      return `"${type.value}"`;
    }

    if (type.type === 'tuple') {
      return `[${type.elements.map(e => typeExpression(e, opts)).join(',')}]`;
    }

    if (type.type === 'typeOperator') {
      return `${type.operator}${typeExpression(type.target, opts)}`;
    }

    if (type.type === 'union') {
      return type.types.map(tt => typeExpression(tt, opts)).join(' | ');
    }
  }

  if (getFunctionNode(type)) {
    console.log('FN', type);
    return 'function';
  }

  // { Object literal }

  if (isObjecty(type) && type.typedocs?.length) {
    if (opts?.compact) {
      return !isInternalType(type) ? type.name : 'object';
    }

    const props = type.typedocs
      .map(
        child =>
          `${child.name}${child.flags.isOptional ? '?:' : ':'} ${typeExpression(
            child.type || child,
            opts,
          )}`,
      )
      .join('; ');

    return `{ ${props}}`;
  }

  return '???';
}
