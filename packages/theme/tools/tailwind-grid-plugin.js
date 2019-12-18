module.exports = function gridPlugin({ addUtilities, theme }) {
  const { columns = 12 } = theme('grid', {});
  const spacing = theme('spacing', {});

  const grid = {
    '.grid': {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`
    }
  };

  for (let col = 1; col < columns + 1; col++) {
    grid[`.col-${col}`] = {
      // position: 'relative',
      gridColumnEnd: `span ${col}`
    };
  }
  Object.entries(spacing).forEach(([size, length]) => {
    grid[`.gap-${size}`] = { gridGap: length };
    grid[`.gap-x-${size}`] = { rowGap: length };
    grid[`.gap-y-${size}`] = { columnGap: length };
  });

  addUtilities(grid, {
    variants: ['responsive']
  });
};
