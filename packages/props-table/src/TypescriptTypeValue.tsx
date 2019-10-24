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

interface TSLiteral {
  name: 'literal';
  value: string;
}

interface TSUnion {
  name: 'union';
  raw: string;
  elements: TSType[];
}

interface TSTuple {
  name: 'tuple';
  raw: string;
  elements: TSType[];
}

interface TSIntersect {
  name: 'intersect';
  raw: string;
  elements: TSType[];
}

export type TSConcreteType =
  | TSLiteral
  | TSUnion
  | TSTuple
  | TSIntersect
  | TSFunctionSignature
  | TSObjectSignature;

export type TSType = TSSimple | TSComplexType | TSConcreteType;

interface Props {
  type: TSType;
  doclets: Doclet[];
}

function getType(type: TSType, doclets: Doclet[]): ReactNode {
  const concrete = type as TSConcreteType;

  switch (concrete.name) {
    case 'literal':
      return <span className="pt-ts-type__literal">{concrete.name}</span>;
    case 'signature':
      return <span className="pt-ts-type__signature">{concrete.raw}</span>;
    case 'union':
      return (
        <span className="pt-ts-type__union">
          {concrete.elements.map(val => (
            <span>{getType(val, doclets)}</span>
          ))}
        </span>
      );
    case 'tuple': {
      return (
        <span className="pt-ts-type__tuple">
          [
          {joinElements(concrete.elements, ', ', val => getType(val, doclets))}
          ]
        </span>
      );
    }
    case 'intersect':
      return (
        <span className="pt-ts-type__intersect">
          {concrete.elements.map(val => getType(val, doclets))}
        </span>
      );
    default:
      if ('elements' in type) {
        return (
          <span className="pt-ts-type__elements">
            {type.name}
            {'<'}
            {joinElements(type.elements, ', ', val => (
              <span>{getType(val, doclets)}</span>
            ))}
            {'>'}
          </span>
        );
      }
      return type.name;
  }
}

function TypescriptTypeValue({ type, doclets }: Props) {
  return <>{getType(type, doclets)}</>;
}

export default TypescriptTypeValue;
