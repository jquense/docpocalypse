/* eslint-disable @typescript-eslint/no-use-before-define */
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
  if (node.name === '__namedParameters') return '__namedParameters';
  return isInternalType(node) ? node.originalName : node.name;
};

export const getFunctionNode = (
  definition?: TypedocNode,
): false | TypedocNode => {
  if (!definition) return false;
  if (definition.kind === Kind.TypeLiteral && definition.signatures?.length) {
    return getFunctionNode(definition.signatures![0]);
  }

  if (
    definition.kind === Kind.CallSignature ||
    definition.parameters?.length ||
    definition.signatures?.length
  )
    return definition;

  return getFunctionNode(getLinkedNode(definition));
};

export const getReturnType = (definition: TypedocNode) => {
  if (definition.kind === Kind.CallSignature) {
    return definition.type;
  }
  if (definition.kind === Kind.TypeLiteral) {
    return getReturnType(definition.signatures![0]);
  }

  const typeNode = getLinkedNode(definition);
  if (typeNode) return getReturnType(typeNode);

  return definition.type || definition || { name: '???', type: 'intrinsic' };
};

export const getParams = (
  def: TypedocNode,
  {
    includeTypes = true,
    ignoreParams = [],
  }: { includeTypes?: boolean; ignoreParams?: string[] } = {},
) =>
  def.parameters
    ? def
        .parameters!.filter((param) => !ignoreParams.includes(param.name))
        .map((param) => {
          const name = getReadableName(param);
          const type =
            param.type && includeTypes ? `: ${typeExpression(param.type)}` : '';

          return `${param.flags.isRest ? '...' : ''}${name}${
            param.flags.isOptional ? '?' : ''
          }${type}`;
        })
    : [];

const isType = (node: TypedocType | TypedocNode): node is TypedocType =>
  typeof node.type === 'string';

export function tsFunctionExpression(
  definition: TypedocNode,
  opts: { compact?: boolean; arrowStyle?: boolean } = { arrowStyle: true },
): string | null {
  const def = getFunctionNode(definition);

  if (!def) return null;

  const typeParams = definition.typeParameter?.length
    ? `<${definition.typeParameter.map((p) => p.name).join(', ')}>`
    : '';

  const params = getParams(def);

  const returnType = getReturnType(definition);

  return `${typeParams}(${params.join(', ')})${
    opts.arrowStyle ? ' => ' : ': '
  }${typeExpression(returnType, opts)}`;
}

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
      return type.types.map((tt) => typeExpression(tt, opts)).join(' & ');
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
        `<${type
          .typeArguments!.map((t) => typeExpression(t, opts))
          .join(', ')}>`;

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
      return `[${type.elements.map((e) => typeExpression(e, opts)).join(',')}]`;
    }

    if (type.type === 'typeOperator') {
      return `${type.operator}${typeExpression(type.target, opts)}`;
    }

    if (type.type === 'union') {
      return type.types.map((tt) => typeExpression(tt, opts)).join(' | ');
    }
  }

  if (getFunctionNode(type)) {
    return tsFunctionExpression(type, {
      compact: opts?.compact,
      arrowStyle: true,
    });
  }

  if (type.kind === Kind.Class) {
    return type.name;
  }

  // { Object literal }
  if (isObjecty(type) && type.typedocs?.length) {
    if (opts?.compact) {
      return !isInternalType(type) ? type.name : 'object';
    }

    const props = type.typedocs
      .map(
        (child) =>
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
