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

  // return the node if it's a method but no signatures
  if (definition.kind === Kind.Method) {
    return definition;
  }

  return getFunctionNode(getLinkedNode(definition));
};

export const getReturnType = (definition: TypedocNode) => {
  if (definition.kind === Kind.CallSignature) {
    return definition.type;
  }

  if (
    definition.kind === Kind.Function ||
    definition.kind === Kind.Method ||
    definition.kind === Kind.FunctionOrMethod ||
    definition.kind === Kind.TypeLiteral
  ) {
    return definition.signatures!.length
      ? getReturnType(definition.signatures![0])
      : { name: 'void', type: 'intrinsic' }; // Methods that have no params or return value are (): void
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

export function getPropertyKey(node: TypedocNode) {
  return `${node.name}${node.flags.isOptional ? '?' : ''}`;
}

export function getGenericSuffix(typeParameters?: TypedocNode[]) {
  return typeParameters?.length
    ? `<${typeParameters.map((p) => p.name).join(', ')}>`
    : '';
}

export function tsFunctionExpression(
  definition: TypedocNode,
  opts: { compact?: boolean; arrowStyle?: boolean } = { arrowStyle: true },
): string | null {
  const def = getFunctionNode(definition);

  if (!def) return null;

  const typeParams = getGenericSuffix(definition.typeParameter);

  const params = getParams(def);

  const returnType = getReturnType(definition);

  return `${typeParams}(${params.join(', ')})${
    opts.arrowStyle ? ' => ' : ': '
  }${typeExpression(returnType, opts)}`;
}

export function propertyEntries(
  typedocs: TypedocNode[] = [],
): Array<[TypedocNode, TypedocNode]> {
  const result: [TypedocNode, TypedocNode][] = [];

  for (const child of typedocs) {
    if (child.kind === Kind.Method && child.signatures?.length) {
      child.signatures.forEach((sig) => result.push([child, sig]));
    } else {
      result.push([child, child]);
    }
  }

  return result;
}

export default function typeExpression(
  type: TypedocType | TypedocNode,
  opts: { compact?: boolean } = {},
) {
  function printProperties(innerType: TypedocNode) {
    return propertyEntries(innerType.typedocs).reduce(
      (acc, [keyNode, child]) => {
        const key = getPropertyKey(keyNode);

        let value: string;
        if (child.kind === Kind.Method) {
          value = `${key}(): void`;
        } else if (keyNode.kind === Kind.Method) {
          value = `${key}${tsFunctionExpression(child, { arrowStyle: false })}`;
        } else {
          value = `${key}: ${typeExpression(child.type || child, opts)}`;
        }

        return acc ? `${acc}; ${value}` : value;
      },
      '',
    );
  }

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

      // TODO handle type params for linked nodes?
      return type.reference
        ? typeExpression(type.reference, opts)
        : `${type.name}${typeArgs ?? ''}`;
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

  if (type.kind === Kind.TypeAlias) {
    if (type.type && !opts?.compact) return typeExpression(type.type, opts);

    return `${type.name}${getGenericSuffix(type.typeParameter)}`;
  }

  if (type.kind === Kind.Class) {
    return `${type.name}${getGenericSuffix(type.typeParameter)}`;
  }

  if (type.kind === Kind.Interface) {
    const name = `${type.name}${getGenericSuffix(type.typeParameter)}`;
    if (opts?.compact) return name;

    return `${name} { ${printProperties(type)}; }`;
  }

  // { Object literal }
  if (isObjecty(type) && type.typedocs?.length) {
    if (opts?.compact) {
      return !isInternalType(type) ? type.name : 'object';
    }

    return `{ ${printProperties(type)}; }`;
  }

  return '???';
}
