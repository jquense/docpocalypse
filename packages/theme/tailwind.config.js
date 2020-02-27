const base = require('tailwindcss/defaultTheme');

module.exports = ({ theming }) => ({
  theme: {
    screens: base.screens,
    colors: {
      ...(theming === 'full' ? base.colors : {}),

      primary: base.colors.orange[600],
      accent: base.colors.orange[700],
      subtle: base.colors.orange[100],

      white: base.colors.white,
      gray: base.colors.gray,
    },
    fontFamily: {
      ...(theming === 'full' ? base.fontFamily : {}),
      brand: base.fontFamily.sans,
      default: base.fontFamily.sans,
      mono: base.fontFamily.mono,
    },
    height: t => ({
      ...base.height,
      navbar: t('spacing.16'),
    }),
    Heading: true,
    LinkedHeading: true,
    InlineCode: true,
    CodeBlock: true,
    LiveCode: true,
    Paragraph: true,

    Navbar: true,
    SideNavigationPanel: true,
    SideNavigationItem: true,
    SideNavigationHeader: true,
    SideNavigationLink: true,
  },
  ...(theming === 'minimal'
    ? {
        variants: {},
        corePlugins: [
          'preflight',
          'inset',
          'position',

          'display',
          'gridTemplateColumns',
          'gridColumn',
          'flex',
          'flexDirection',
          'alignItems',

          'maxWidth',
          'minHeight',
          'margin',
          'padding',

          'lineHeight',
          'fontFamily',
          'fontSize',
          'fontSmoothing',
          'fontWeight',
          'letterSpacing',

          'listStyleType',

          'borderRadius',
          'backgroundColor',
          'textColor',

          'zIndex',
        ],
      }
    : {}),
});
