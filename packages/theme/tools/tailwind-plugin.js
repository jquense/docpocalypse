const postcss = require('postcss');
const resolveConfig = require('tailwindcss/lib/util/resolveConfig').default;
const defaultConfig = require('tailwindcss/defaultConfig');

const formatCSS = require('tailwindcss/lib/lib/formatCSS').default;
const registerConfigAsDependency = require('tailwindcss/lib/lib/registerConfigAsDependency')
  .default;
const processTailwindFeatures = require('tailwindcss/lib/processTailwindFeatures')
  .default;

const tailwindConfigPath = require.resolve('../tailwind.config');

const plugin = postcss.plugin('tailwind', (config = {}) => {
  const plugins = [registerConfigAsDependency(tailwindConfigPath)];

  if (typeof config === 'string') {
    plugins.push(registerConfigAsDependency(config));
  }

  const getConfig = () => {
    delete require.cache[tailwindConfigPath];
    const base = require(tailwindConfigPath);
    let configObj = config;

    if (typeof config === 'string') {
      delete require.cache[config];
      configObj = require(config);
    }

    return resolveConfig([configObj, base, defaultConfig]);
  };

  return postcss([...plugins, processTailwindFeatures(getConfig), formatCSS]);
});

module.exports = plugin;
