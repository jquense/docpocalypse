import React, { ReactNode } from 'react';
import { Doclet, joinElements } from './utils';

interface TSSimple {
  name: string;
}

interface TSComplexType {
  name: string;
  raw?: string;
  elements: TSType[];
}

interface TSArgument {
  name: string;
  type: TSType;
}

interface TSFunctionSignature {
  name: 'signature';
  type: 'function';
  raw: string;
  signature: {
    arguments: TSArgument[];
    return: TSType;
  };
}

interface TSProperty {
  key: string;
  value: TSType & { required: boolean };
}

interface TSObjectSignature {
  name: 'signature';
  type: 'object';
  raw: string;
  signature: {
    properties: TSProperty[];
  };
}

interface TSArray {
  name: 'Array';
  raw?: string;
  elements: TSType[];
}

interface TSLiteral {
  name: 'literal';
  value: string;
}

interface TSUnion {
  name: 'union';
  raw?: string;
  elements: TSType[];
}

interface TSTuple {
  name: 'tuple';
  raw?: string;
  elements: TSType[];
}

interface TSIntersect {
  name: 'intersect';
  raw: string;
  elements: TSType[];
}

export type TSConcreteType =
  | TSLiteral
  | TSArray
  | TSUnion
  | TSTuple
  | TSIntersect
  | TSFunctionSignature
  | TSObjectSignature;

export type TSType = TSSimple | TSComplexType | TSConcreteType;

export type Token =
  | 'keyword'
  | 'literal'
  | 'primitive'
  | 'array'
  | 'type_signature'
  | 'function_signature'
  | 'object_signature'
  | 'intersect'
  | 'tuple'
  | 'union'
  | 'argument'
  | 'return'
  | 'name'
  | 'elements';

export type TokenMap = Record<Token, string>;

const isPrimitive = (name: string) => name[0].toLowerCase() === name[0];

const isArray = (t: TSType): t is TSArray => t.name === 'Array';

interface Props {
  type: TSType;
  doclets: Doclet[];
  tokens?: TokenMap;
}

function getType(
  type: TSType,
  doclets: Doclet[],
  tokens?: TokenMap
): ReactNode {
  const concrete = type as TSConcreteType;

  const get = (t: TSType) => getType(t, doclets, tokens);
  const t = (token: Token) => tokens?.[token] ?? `pt-token pt-${token}`;

  function renderName(name: string) {
    return (
      <span className={t(isPrimitive(name) ? 'primitive' : 'name')}>
        {name}
      </span>
    );
  }

  function renderNamedType(namedType: TSComplexType) {
    return (
      <span className={t('type_signature')}>
        {renderName(namedType.name)}
        {'elements' in namedType && (
          <>
            {'<'}
            <span className={t('elements')}>
              {joinElements(namedType.elements, ', ', get)}
            </span>
            {'>'}
          </>
        )}
      </span>
    );
  }

  function renderArray(arrType: TSArray) {
    return arrType.elements[0].name !== 'signature' ? (
      <span className={t('array')}>
        {renderName(arrType.elements[0].name)}[]
      </span>
    ) : (
      renderNamedType(arrType)
    );
  }

  switch (concrete.name) {
    case 'literal':
      return <span className={t('literal')}>{concrete.value}</span>;
    case 'signature':
      return (
        <span className={t(`${concrete.type}-signature` as Token)}>
          {concrete.type === 'function' ? (
            <>
              (
              {joinElements(concrete.signature.arguments, ', ', arg => (
                <span className={t('argument')}>
                  {arg.name}: {get(arg.type)}
                </span>
              ))}
              {') => '}
              <span className={t('return')}>
                {get(concrete.signature.return)}
              </span>
            </>
          ) : (
            concrete.raw
          )}
        </span>
      );
    case 'union':
      return <span className={t('union')}>{concrete.elements.map(get)}</span>;
    case 'tuple': {
      return (
        <span className={t('tuple')}>
          [{joinElements(concrete.elements, ', ', get)}]
        </span>
      );
    }
    case 'intersect':
      return (
        <span className={t('intersect')}>{concrete.elements.map(get)}</span>
      );
    default:
      if (isArray(type)) return renderArray(type);
      if (isPrimitive(type.name)) renderName(type.name);
      return renderNamedType(type as TSComplexType);
  }
}

function TypescriptTypeValue({ type, doclets, tokens }: Props) {
  return <>{getType(type, doclets, tokens)}</>;
}

export default TypescriptTypeValue;
