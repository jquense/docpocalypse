import { Theme } from 'theme-ui';
import { base } from '@theme-ui/presets';

import { AliasedScale } from '../styled';

const breakpoints: AliasedScale<string> = [
  '576px',
  '768px',
  '992px',
  '1200px',
] as {};

breakpoints.sm = breakpoints[0];
breakpoints.md = breakpoints[1];
breakpoints.lg = breakpoints[2];
breakpoints.xl = breakpoints[3];

const fontSizes: AliasedScale<string> = [
  '1.2rem',
  '1.4rem',
  '1.6rem',
  '2.0rem',
  '2.4rem',
  '3.2rem',
  '4.8rem',
  '6.4rem',
  '9.6rem',
] as {};

fontSizes.root = '10px';
fontSizes.body = fontSizes[0];

const defaultTheme: Theme = {
  ...base,
  fontSizes,
  breakpoints,
  // extending the colors only
  colors: {
    ...base.colors,
    text: '#111',
    background: 'red',
  },
  styles: {
    ...base.styles,
    root: {
      ...base.styles.root,
      fontSize: 'body',
    },
  },
};

// const defaultTheme: Theme = {
//   breakpoints,

//   color: {
//     textColor: '#333',
//     primary: 'blue',
//     secondary: 'green',
//   },
//   borderRadius: '4px',
//   body: {
//     color: '#333',
//     bg: '#fff',
//   },

//   fontFamily: {
//     sansSerif:
//       '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
//     monospace:
//       'source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace',
//   },
//   divider: {
//     color: '#ececec',
//   },
//   navbar: {
//     height: '6rem',
//     bg: '#333',
//     color: 'white',
//   },
// };

export default defaultTheme;
