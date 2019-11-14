/* eslint-disable default-case */
/* eslint-disable no-param-reassign */

import Stylis from 'stylis';
import ruleSheetPlugin from 'stylis-rule-sheet';
import hash from './hash';

const rSelector = /(:global\((.*?\.[a-zA-Z0-9_-]+)\))|\.([a-zA-Z0-9_-]+)/g;
const rComposes = /composes\s*?:\s*(.*?)(?=from\s*?(.+)|$)/i;

const execAll = (regex: RegExp, str: string) => {
  const results: RegExpExecArray[] = [];
  let m: RegExpExecArray | null;
  // eslint-disable-next-line no-cond-assign
  while ((m = regex.exec(str))) if (m) results.push(m);
  return results;
};

const replaceMap = <T>(arr: T[], fn: (item: T, idx: number) => T) => {
  for (let i = 0; i < arr.length; i++) arr[i] = fn(arr[i], i);
};

type Composes = { global: boolean; key: string };

export default function toCss(root: string, css: string) {
  const rules: string[] = [];
  const hashMap: Record<string, string> = Object.create(null);
  const composesMap: Record<string, Composes[]> = Object.create(null);

  function hashClasses(selector: string) {
    return selector.replace(
      rSelector,
      (_, fullGlobal, globalSelector, className) => {
        if (fullGlobal) return globalSelector;
        if (root.endsWith(className)) return `.${className}`;
        const hashed = hashMap[className] || `sg-${hash(className)}`;
        hashMap[className] = hashed;
        return `.${hashed}`;
      }
    );
  }

  const stylis = new Stylis({
    global: false,
    cascade: true,
    keyframe: true,
    prefix: false,
    compress: false,
    semicolon: false
  });

  stylis.use(
    ruleSheetPlugin(rule => {
      rules.push(rule);
    })
  );

  stylis.use((ctx, str, selectors) => {
    switch (ctx) {
      case 2: {
        replaceMap(selectors, hashClasses);
        break;
      }
      case 1: {
        const composes = str.match(rComposes);
        if (!composes) return undefined;

        selectors.forEach(s => {
          const matches = execAll(rSelector, s);

          if (matches.length > 1) {
            throw new Error('Composes on none simple selector');
          }

          const global = (composes[2] || '').trim() === 'global';
          (
            composesMap[matches[0][3]] || (composesMap[matches[0][3]] = [])
          ).push(
            ...composes[1]
              .split(' ')
              .filter(Boolean)
              .map(cls => ({
                global,
                key: cls.trim().replace(/^\./, '')
              }))
          );
        });

        return '';
      }
    }
    return undefined;
  });

  const processed = stylis(root, css);

  const exports: Record<string, string> = Object.create(null);

  Object.entries(hashMap).forEach(([cls, hashed]) => {
    const composes = composesMap[cls || hashed];
    exports[cls] =
      hashed +
      (composes
        ? ` ${composes
            .map(k => (k.global ? k.key : hashMap[k.key] || k.key))
            .join(' ')}`
        : '');
  });

  return { css: processed, rules, exports };
}
