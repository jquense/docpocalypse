import React, { ReactNode, useMemo } from 'react';
import TypescriptTypeValue, { TSType, TokenMap } from './TypescriptTypeValue';
import {
  Doclet,
  cleanDocletValue,
  getDisplayTypeName,
  getDoclet
} from './utils';

interface ObjectPropType {
  name: 'object';
}
interface CustomPropType {
  name: 'custom';
  raw: string;
}

interface ArrayPropType {
  name: 'arrayOf';
  value: PropType;
}

interface ShapePropType {
  name: 'shape';
  value: Record<string, PropType & { required: boolean }>;
}

interface UnionPropType {
  name: 'union';
  value: PropType[];
}

interface EnumPropType {
  name: 'enum';
  value: string | Array<{ value: string; computed: boolean }>;
}

export type PropType =
  | ObjectPropType
  | CustomPropType
  | ArrayPropType
  | EnumPropType
  | UnionPropType
  | ShapePropType;

interface Props {
  type: PropType;
  doclets: Doclet[];
  tokens?: TokenMap;
}

function Enum({ type }: { type: EnumPropType }) {
  const enumValues = type.value || [];
  if (!Array.isArray(enumValues)) return <>{enumValues}</>;

  return (
    <span className="pt-type__enum">
      {enumValues.map(c => (
        <span key={c.value}>{c.value}</span>
      ))}
    </span>
  );
}

function getType(type: PropType, doclets: Doclet[]) {
  const name = getDisplayTypeName(type.name);
  const docletType = getDoclet(doclets, 'type');

  switch (type.name) {
    case 'object':
      return <span className="pt-type__object">{name}</span>;
    case 'union':
      return type.value.reduce(
        (current: ReactNode[], val: any, i: number, list: any[]) => {
          let item = getType(val, doclets);
          if (React.isValidElement(item)) {
            // eslint-disable-next-line react/no-array-index-key
            item = React.cloneElement(item, { key: i });
          }
          // eslint-disable-next-line no-param-reassign
          current = current.concat(item);

          return i === list.length - 1 ? current : current.concat(' | ');
        },
        []
      );
    case 'arrayOf': {
      const child = getType(type.value, doclets);

      return (
        <span className="pt-type__array-of">
          {'array<'}
          <span>{child}</span>
          {'>'}
        </span>
      );
    }
    case 'enum':
      return <Enum type={type} />;
    case 'custom':
      return (
        <span className="pt-type__custom">
          {cleanDocletValue(docletType || type.raw)}
        </span>
      );
    default:
      return <span className="pt-type__literal">{name}</span>;
  }
}

function mapToTypes(propType: PropType, doclets: Doclet[]): TSType {
  const map = (pt: PropType) => mapToTypes(pt, doclets);

  const name = getDisplayTypeName(propType.name);
  const docletType = getDoclet(doclets, 'type');

  switch (propType.name) {
    case 'object':
      return { name: 'Object' };

    case 'shape':
      return {
        name: 'signature',
        type: 'object',
        raw: '',
        signature: {
          properties: Object.entries(propType.value).map(([key, value]) => ({
            key,
            value: {
              ...map(value),
              required: value.required
            }
          }))
        }
      };
    case 'union':
      return { name: 'union', elements: propType.value.map(map) };
    case 'enum': {
      const enumValues = propType.value || [];

      if (!Array.isArray(enumValues)) {
        return { name: enumValues };
      }

      return {
        name: 'union',
        elements: enumValues.map(e => ({ name: e.value }))
      };
    }
    case 'arrayOf':
      return { name: 'Array', elements: [map(propType.value)] };
    case 'custom':
      return { name: cleanDocletValue(docletType || propType.raw) };
    default:
      return { name: 'literal', value: name };
  }
}

function PropTypeValue({ type, doclets, tokens }: Props) {
  const tsType = useMemo(() => mapToTypes(type, doclets), [type, doclets]);
  return (
    <TypescriptTypeValue type={tsType} doclets={doclets} tokens={tokens} />
  );
}

export default PropTypeValue;
