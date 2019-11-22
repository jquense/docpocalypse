const templates = {
  default: require.resolve('./src/components/PageLayout.js'),
  component: require.resolve('./src/templates/component.tsx'),
  hook: require.resolve('./src/templates/hook.tsx')
};

module.exports = (options = {}) => {
  return {
    plugins: [
      'gatsby-plugin-typescript',
      {
        resolve: require.resolve('./plugins/css-plugin'),
        options: {
          postcssPlugins: [
            require('tailwindcss')(require('./tailwind.config')),
            require('postcss-nested')
          ]
        }
      },
      {
        resolve: 'docpocalypse-core',
        options: {
          templates,
          ...options
        }
      }
    ]
  };
};
