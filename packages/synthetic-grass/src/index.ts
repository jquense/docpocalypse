import isAstroturf from 'astroturf';
import Stylis from 'stylis';
import rulesheetPlugin from 'stylis-rule-sheet';
import units from './css-units';
import hash from './hash';
import toCss from './to-css';

const rUnit = new RegExp(`^(${units.join('|')})(;|,|\n| |\\))`);

const interweave = (
  strings: TemplateStringsArray,
  interpolations: any[]
): any[] => {
  const result = [strings[0]];
  for (let i = 0, len = interpolations.length; i < len; i += 1) {
    result.push(interpolations[i], strings[i + 1]);
  }
  return result;
};

class StyleSheet {
  style: HTMLStyleElement;

  constructor() {
    this.style = document.createElement('style');
    this.style.setAttribute('data-synthetic-grass', '');
    document.head.appendChild(this.style); // must append before you can access sheet property
  }

  get sheet() {
    return this.style.sheet as CSSStyleSheet;
  }

  insertRules(rules: string[]) {
    rules.forEach((rule, idx) => this.sheet.insertRule(rule, idx));
  }
}

export function css(strings: TemplateStringsArray, ...values: any[]) {
  const sheet = new StyleSheet();

  const cssText = interweave(
    strings,
    values.map(i => (i.isAstroturf ? `.${i.className}` : String(i)))
  ).join('');

  const result = toCss('', cssText);
  sheet.insertRules(result.rules);
  return result.exports;
}

// let uid = 0;
// function createTaggedTemplate(propsGetter?: any) {
//   function createComponent(target, opts, style) {
//     const id = hash(`sg-${uid++}`);
//   }

//   function f(strings: string[], ...values: any[]) {
//     const cssText = interweave(
//       strings,
//       values.map(i => (i.isAstroturf ? `.${i.className}` : String(i)))
//     ).join('');
//   }
// }

// function styled(type) {}

// const args;

// let css = '';
// let lastDynamic: { id: string; unit: string } = null;

// for (const [idx, quasi] of strings.entries()) {
//   const expr = values.shift();
//   let matches;

//   // If the last quasi is a replaced dynamic import then see if there
//   // was a trailing css unit and extract it as part of the interpolation
//   // eslint-disable-next-line no-cond-assign
//   if (
//     lastDynamic &&
//     css.endsWith(`var(--${lastDynamic.id})`) &&
//     (matches = quasi.match(rUnit))
//   ) {
//     const [, unit] = matches;

//     lastDynamic.unit = unit;
//     css += quasi.replace(rUnit, '$2');
//   } else {
//     css += quasi;
//   }

//   if (!expr) {
//     return;
//   }

//   css += expr.isAstroturf ? expr.className : String(expr);
// }

// strings.forEach((acc, next) => {
//   const value = values.shift();

//   return `${acc}${value}`;
// })
