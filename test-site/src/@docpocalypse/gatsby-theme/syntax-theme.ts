// import { css } from 'astroturf';

// const _ = css`
//   :root {
//     --prism-token-tag: theme('prism.tag');
//     --prism-token-string: theme('prism.string');
//     --prism-token-className: theme('prism.className');
//   }
// `;
// console.log(_);
// const colors = {
//   char: '#D8DEE9',
//   comment: '#999999',
//   keyword: '#c5a5c5',
//   primitive: '#5a9bcf',
//   string: 'var(--prism-token-string)',
//   variable: '#d7deea',
//   boolean: '#ff8b50',
//   punctuation: '#5FB3B3',
//   tag: 'var(--prism-token-tag)',
//   function: '#79b6f2',
//   className: 'var(--prism-token-className)',
//   method: '#6699CC',
//   operator: '#fc929e'
// };

// const theme = {
//   plain: {
//     color: 'inherit'
//   },
//   styles: [
//     {
//       types: ['attr-name'],
//       style: {
//         color: colors.keyword
//       }
//     },
//     {
//       types: ['attr-value'],
//       style: {
//         color: colors.string
//       }
//     },
//     {
//       types: ['comment', 'block-comment', 'prolog', 'doctype', 'cdata'],
//       style: {
//         color: colors.comment
//       }
//     },
//     {
//       types: [
//         'property',
//         'number',
//         'function-name',
//         'constant',
//         'symbol',
//         'deleted'
//       ],
//       style: {
//         color: colors.primitive
//       }
//     },
//     {
//       types: ['boolean'],
//       style: {
//         color: colors.boolean
//       }
//     },
//     {
//       types: ['tag'],
//       style: {
//         color: colors.tag
//       }
//     },
//     {
//       types: ['string'],
//       style: {
//         color: colors.string
//       }
//     },
//     {
//       types: ['punctuation'],
//       style: {
//         color: colors.string
//       }
//     },
//     {
//       types: ['selector', 'char', 'builtin', 'inserted'],
//       style: {
//         color: colors.char
//       }
//     },
//     {
//       types: ['function'],
//       style: {
//         color: colors.function
//       }
//     },
//     {
//       types: ['operator', 'entity', 'url', 'variable'],
//       style: {
//         color: colors.variable
//       }
//     },
//     {
//       types: ['keyword'],
//       style: {
//         color: colors.keyword
//       }
//     },
//     {
//       types: ['at-rule', 'class-name'],
//       style: {
//         color: colors.className
//       }
//     },
//     {
//       types: ['important'],
//       style: {
//         fontWeight: '400'
//       }
//     },
//     {
//       types: ['bold'],
//       style: {
//         fontWeight: 'bold'
//       }
//     },
//     {
//       types: ['italic'],
//       style: {
//         fontStyle: 'italic'
//       }
//     },
//     {
//       types: ['namespace'],
//       style: {
//         opacity: 0.7
//       }
//     }
//   ]
// };

// export default theme;

// Original: https://github.com/sdras/night-owl-vscode-theme
// Converted automatically using ./tools/themeFromVsCode
const theme = {
  styles: [
    {
      types: ['changed'],
      style: {
        color: 'rgb(162, 191, 252)',
        fontStyle: 'italic'
      }
    },
    {
      types: ['deleted'],
      style: {
        color: 'rgba(239, 83, 80, 0.56)',
        fontStyle: 'italic'
      }
    },
    {
      types: ['inserted', 'attr-name'],
      style: {
        color: 'rgb(72, 118, 214)',
        fontStyle: 'italic'
      }
    },
    {
      types: ['comment'],
      style: {
        color: 'rgb(152, 159, 177)',
        fontStyle: 'italic'
      }
    },
    {
      types: ['string', 'builtin', 'char', 'constant', 'url'],
      style: {
        color: 'rgb(72, 118, 214)'
      }
    },
    {
      types: ['variable'],
      style: {
        color: 'rgb(201, 103, 101)'
      }
    },
    {
      types: ['number'],
      style: {
        color: 'rgb(170, 9, 130)'
      }
    },
    {
      // This was manually added after the auto-generation
      // so that punctuations are not italicised
      types: ['punctuation'],
      style: {
        color: 'rgb(153, 76, 195)'
      }
    },
    {
      types: ['function', 'selector', 'doctype'],
      style: {
        color: 'rgb(153, 76, 195)',
        fontStyle: 'italic'
      }
    },
    {
      types: ['class-name'],
      style: {
        color: 'rgb(17, 17, 17)'
      }
    },
    {
      types: ['tag'],
      style: {
        color: 'rgb(153, 76, 195)'
      }
    },
    {
      types: ['operator', 'property', 'keyword', 'namespace'],
      style: {
        color: 'rgb(12, 150, 155)'
      }
    },
    {
      types: ['boolean'],
      style: {
        color: 'rgb(188, 84, 84)'
      }
    }
  ]
};

export default theme;
