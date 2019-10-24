import React, { ReactNode } from 'react';
import {
  Doclet,
  cleanDocletValue,
  getDisplayTypeName,
  getDoclet,
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
        [],
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

function PropTypeValue({ type, doclets }: Props) {
  return <>{getType(type, doclets)}</>;
}

export default PropTypeValue;
