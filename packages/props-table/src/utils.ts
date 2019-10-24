import React, { ReactNode } from 'react';

export interface Doclet {
  tag: string;
  value: string;
}

export function docletsToMap(doclets: Doclet[]) {
  return new Map(doclets.map(({ tag, value }) => [tag, value]));
}

export function getDoclet(doclets: Doclet[] = [], tag: string) {
  const doc = doclets.find(d => d.tag === tag);
  return doc && doc.value;
}

export function cleanDocletValue(str: string) {
  return str
    .trim()
    .replace(/^\{/, '')
    .replace(/\}$/, '');
}

export function getDisplayTypeName(typeName: string) {
  if (typeName === 'func') return 'function';
  if (typeName === 'bool') return 'boolean';

  return typeName;
}

export function getTypeName(prop: any) {
  const type = prop.type || {};
  const name = getDisplayTypeName(type.name);

  if (name === 'custom')
    return cleanDocletValue(getDoclet(prop.doclets, 'type') || type.raw);

  return name;
}

export function joinElements<T>(
  arr: Array<T>,
  delim: ReactNode,
  fn: (item: T, idx: number) => ReactNode,
) {
  return arr.reduce(
    (acc, val, idx, list) => {
      let item = fn(val, idx);
      if (React.isValidElement(item)) {
        // eslint-disable-next-line react/no-array-index-key
        item = React.cloneElement(item, { key: idx });
      }

      // eslint-disable-next-line no-param-reassign
      acc = acc.concat(item);

      return idx === list.length - 1 ? acc : acc.concat(delim);
    },
    [] as ReactNode[],
  );
}
