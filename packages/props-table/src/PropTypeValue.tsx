import React, { useMemo } from 'react';

import TypescriptTypeValue, { TokenMap } from './TypescriptTypeValue';
import { Doclet, PropType, TSType } from './types';
import { cleanDocletValue, getDisplayTypeName, getDoclet } from './utils';

export interface Props {
  type: PropType;
  tags: Doclet[];
  tokens?: TokenMap;
}

function mapToTypes(propType: PropType, tags: Doclet[]): TSType {
  const map = (pt: PropType) => mapToTypes(pt, tags);

  const name = getDisplayTypeName(propType.name);
  const docletType = getDoclet(tags, 'type');

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
              required: value.required,
            },
          })),
        },
      };
    case 'union':
      return {
        name: 'union',
        elements: propType.value
          .map(n => (typeof name === 'string' ? { name: n } : n))
          .map(map),
      };
    case 'enum': {
      const enumValues = propType.value || [];

      if (!Array.isArray(enumValues)) {
        return { name: enumValues };
      }

      return {
        name: 'union',
        elements: enumValues.map(e => ({ name: e.value })),
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

function PropTypeValue({ type, tags, tokens }: Props) {
  const tsType = useMemo(() => mapToTypes(type, tags), [type, tags]);
  return <TypescriptTypeValue type={tsType} tags={tags} tokens={tokens} />;
}

export default PropTypeValue;
