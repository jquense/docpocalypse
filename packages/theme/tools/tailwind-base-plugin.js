function headings(base, addUtilities) {
  const { h } = base;

  const utils = {};
  if (h) {
    utils[`.docs-h`] = h;
  }

  [1, 2, 3, 4, 5, 6].forEach(lvl => {
    const key = `h${lvl}`;

    if (base[key]) {
      utils[`.docs-${key}`] = { ...base[key] };
    }
  });

  addUtilities(utils, {
    variants: []
  });
}

module.exports = function gridPlugin({ addUtilities, theme }) {
  const base = theme('base', {});

  headings(base, addUtilities);
};
