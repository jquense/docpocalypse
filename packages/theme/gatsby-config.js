const templates = {
  default: require.resolve('./src/components/PageLayout.js'),
  component: require.resolve('./src/templates/component.tsx'),
  hook: require.resolve('./src/templates/hook.tsx')
};

const tailwindConfigPath = require.resolve('./tailwind.config');

module.exports = (options = {}) => {
  return {
    plugins: [
      'gatsby-plugin-typescript',
      {
        resolve: require.resolve('./plugins/css-plugin'),
        options: {
          postcssPlugins: loader => {
            loader.addDependency(tailwindConfigPath);
            return [
              require('tailwindcss')(tailwindConfigPath),
              require('postcss-nested')
            ];
          }
        }
      },
      {
        resolve: '@docpocalypse/gatsby-theme-core',
        options: {
          templates,
          ...options
        }
      }
    ]
  };
};
