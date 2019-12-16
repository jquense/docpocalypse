module.exports = {
  theme: {
    base: t => ({
      h: {
        marginBottom: t('spacing.4')
      },
      h2: {
        marginBottom: t('spacing.8')
      }
    }),
    extend: {
      navbar: {
        height: '4rem'
      }
    }
  }
};
