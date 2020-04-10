import React, { ReactNode } from 'react';

import {
  Doclet,
  TSArray,
  TSComplexType,
  TSConcreteType,
  TSType,
} from './types';
import { getDoclet, joinElements } from './utils';

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

const isComplex = (t: TSType): t is TSConcreteType =>
  ['signature', 'union', 'tuple', 'intersect'].includes(t.name);

interface Props {
  type: TSType;
  tags: Doclet[];
  tokens?: TokenMap;
}

function getType(type: TSType, tags: Doclet[], tokens?: TokenMap): ReactNode {
  const concrete = type as TSConcreteType;

  const get = (t: TSType) => getType(t, tags, tokens);
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
    return isComplex(arrType.elements[0]) ? (
      renderNamedType(arrType)
    ) : (
      <span className={t('array')}>{get(arrType.elements[0])}[]</span>
    );
  }
  const userType = getDoclet(tags, 'type');
  if (userType) return renderName(userType);

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
      return (
        <span className={t('union')}>
          {joinElements(concrete.elements, null, get)}
        </span>
      );
    case 'tuple': {
      return (
        <span className={t('tuple')}>
          [{joinElements(concrete.elements, ', ', get)}]
        </span>
      );
    }
    case 'intersect':
      return (
        <span className={t('intersect')}>
          {joinElements(concrete.elements, null, get)}
        </span>
      );
    default:
      if (isArray(type)) return renderArray(type);
      if (isPrimitive(type.name)) renderName(type.name);
      return renderNamedType(type as TSComplexType);
  }
}

function TypescriptTypeValue({ type, tags, tokens }: Props) {
  return <>{getType(type, tags, tokens)}</>;
}

export default TypescriptTypeValue;
