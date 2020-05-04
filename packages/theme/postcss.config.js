module.exports = () => {
  return {
    parser: 'postcss-scss',
    plugins: [require('postcss-nested')],
  };
};
