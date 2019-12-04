const base = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    colors: {
      white: base.colors.white,
      gray: base.colors.gray
    },
    fontFamily: {
      default: base.fontFamily.sans,
      mono: base.fontFamily.mono
    },
    body: t => ({
      'bg-color': t('colors.white'),
      color: t('colors.gray.800')
    }),

    navbar: t => ({
      height: t('spacing.16'),
      color: t('colors.white'),
      'bg-color': t('colors.gray.100')
    }),

    'divider-color': t => t('colors.gray.300'),

    'side-nav': t => ({
      'bg-color': t('colors.gray.100')
    })
  },
  variants: {},
  plugins: [require('./tools/tailwind-grid-plugin')]
};
