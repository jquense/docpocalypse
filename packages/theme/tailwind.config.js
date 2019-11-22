module.exports = {
  theme: {
    body: t => ({
      color: t('colors.gray.800')
    }),
    navbar: t => ({
      height: t('spacing.16'),
      color: t('colors.white'),
      'bg-color': t('colors.gray.600')
    })
  },
  variants: {},
  plugins: [require('./tools/tailwind-grid-plugin')]
};
