const themingPlugin = require('./tools/theming-plugin');

// options here is set in gatsby-config as postcssOptions.config.ctx (omg)
module.exports = ({ options }) => {
  return {
    parser: 'postcss-scss',
    plugins: [themingPlugin(options), require('postcss-nested')],
  };
};
