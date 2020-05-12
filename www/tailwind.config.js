module.exports = {
  theme: {
    prism: t => ({
      'bg-color': '#282c34',
      char: '#d8dee9',
      comment: '#999999',
      keyword: '#c5a5c5',
      lineHighlight: '#14161a',
      primitive: '#5a9bcf',
      string: t('colors.green.500'),
      variable: '#d7deea',
      boolean: '#ff8b50',
      punctuation: '#5fb3b3',
      tag: t('colors.orange.700'),
      function: '#79b6f2',
      className: t('colors.orange.700'),
      method: '#6699cc',
      operator: '#fc929e'
    }),

    extend: {
      fontFamily: {
        mono: 'Cutive Mono, monospace',
        brand: 'Marcellus, serif'
      },
      Heading: {
        '@apply font-brand': true
      }
    }
    // Navbar: true,
  }
};
