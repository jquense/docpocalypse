const templates = {
  default: require.resolve('./src/components/PageLayout.js'),
  component: require.resolve('./src/templates/component.tsx'),
  hook: require.resolve('./src/templates/hook.tsx')
};

const tailwindConfigPath = require.resolve('./tailwind.config');

module.exports = (options = {}) => {
  return {
    plugins: [
      {
        resolve: 'gatsby-plugin-astroturf',
        options: { extension: '.module.css', enableCssProp: true }
      },
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
        resolve: 'docpocalypse-core',
        options: {
          templates,
          ...options
        }
      }
    ]
  };
};
