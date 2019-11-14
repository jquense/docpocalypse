const path = require('path');

const templates = {
  default: require.resolve('./src/components/PageLayout.js'),
  component: require.resolve('./src/templates/component.tsx'),
  hook: require.resolve('./src/templates/hook.tsx'),
};

module.exports = (options = {}) => {
  return {
    plugins: [
      'gatsby-plugin-typescript',
      {
        resolve: 'docpocalypse-core',
        options: {
          templates,
          ...options,
        },
      },
    ],
  };
};
