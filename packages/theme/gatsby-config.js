const resolveConfig = require('tailwindcss/lib/util/resolveConfig').default;
const defaultConfig = require('tailwindcss/defaultConfig');

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

            delete require.cache[tailwindConfigPath];
            const base = require(tailwindConfigPath);

            return [
              require('tailwindcss')(
                resolveConfig([options.config || {}, base, defaultConfig])
              ),
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
