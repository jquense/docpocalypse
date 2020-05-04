const merge = require('lodash/merge');
const postcss = require('postcss');
const postcssJs = require('postcss-js');
const resolveConfig = require('tailwindcss/lib/util/resolveConfig').default;
const defaultConfig = require('tailwindcss/defaultConfig');
const formatCSS = require('tailwindcss/lib/lib/formatCSS').default;
const registerConfigAsDependency = require('tailwindcss/lib/lib/registerConfigAsDependency')
  .default;
const processTailwindFeatures = require('tailwindcss/lib/processTailwindFeatures')
  .default;

const tailwindConfigPath = require.resolve('../tailwind.config');

const themingValues = ['full', 'minimal', 'none'];

function themeAtRulePlugin(theming) {
  return (css) => {
    css.walkAtRules('theme', (atRule) => {
      const config = postcss.list.space(atRule.params);
      if (!config.every((c) => themingValues.includes(c))) {
        throw atRule.error(
          `Unrecognized theming configuration: \`${config}\`.`,
        );
      }

      if (config.includes(theming)) {
        atRule.before(atRule.nodes);
      }
      atRule.remove();
    });
  };
}

function componentAtRulePlugin(getConfig, theming) {
  return (css) => {
    const themePlugin = themeAtRulePlugin(theming);
    const { theme, userConfig } = getConfig();
    const userTheme = userConfig && userConfig.theme;

    css.walkAtRules('component', (atRule) => {
      const [name, ident = `.${name}`] = postcss.list.space(atRule.params);

      const isExtending =
        userTheme && userTheme.extend && name in userTheme.extend;

      const hasChildren = atRule.nodes && atRule.nodes.length;
      const themeValue = theme[name];

      if (themeValue === undefined) {
        throw atRule.error(`Unrecognized component: \`${name}\`.`);
      }

      if (themeValue === false || (themeValue === true && !hasChildren)) {
        atRule.remove();
        return;
      }

      if (theming === 'none') {
        if (isExtending)
          css.error(
            `Component ${name} is being extended but the theming config option is set to "none". ` +
              `Extensions aren't possible when theming is disabled because the default styles don't exist.`,
          );

        // just remove and return for "true" values
        if (themeValue === true) {
          atRule.remove();
          return;
        }
      }

      let defaultStyle = null;

      if ((isExtending || themeValue === true) && hasChildren) {
        const inner = postcss.root().append(...atRule.nodes);

        // resolve theming here so config merges are easier (and cleaner)
        themePlugin(inner);

        defaultStyle = postcssJs.objectify(inner);
      }

      const content = defaultStyle
        ? merge(defaultStyle, themeValue)
        : themeValue;

      const { nodes } = postcss().process(
        {
          [ident]: content,
        },
        { parser: postcssJs },
      ).root;

      atRule.replaceWith(nodes);
    });
  };
}

const plugin = postcss.plugin('tailwind', (gatsbyThemeOptions = {}) => {
  const { tailwindConfig: config = {}, theming = 'full' } = gatsbyThemeOptions;

  function getConfig() {
    delete require.cache[tailwindConfigPath];
    const base = require(tailwindConfigPath)({ theming });
    let configObj = config;

    if (typeof config === 'string') {
      delete require.cache[config];
      configObj = require(config);
    }

    const resolved = resolveConfig([configObj, base, defaultConfig]);

    resolved.userConfig = configObj;
    return resolved;
  }

  const plugins = [
    componentAtRulePlugin(getConfig, theming),
    themeAtRulePlugin(theming),
    registerConfigAsDependency(tailwindConfigPath),
  ];

  if (typeof config === 'string') {
    plugins.push(registerConfigAsDependency(config));
  }

  return postcss([...plugins, processTailwindFeatures(getConfig), formatCSS]);
});

module.exports = plugin;
