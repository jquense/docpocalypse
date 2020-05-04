# `gatsby-plugin-css`

A Gatsby plugin for configuring css.

## Usage

```sh
npm i gatsby-plugin-css
```

And in your `gatsby-config.js`

```js
module.exports = (options = {}) => {
  return {
    plugins: [
      {
        resolve: 'gatsby-plugin-css',
        options: {
          // By default the plugin will _replace_ gatsby's css-loader
          replaceExisting: true,
        },
      },
    ],
  };
};
```

## What's wrong with Gatsby's built-in CSS support

Nothing particularly, but Gatsby's built-in support is tied to major versions of Gatsby which
means that the tooling it uses is OLD. This plugin can update css-loader and friends more frequently!

This plugin also comes with built in PostCSS config support!

## PostCSS Support

Drop a `postcss.config.js` file into your root directory and everything is handled
automatically. Including autoprefixing to your configured browsers list.

If you would would like to disable postcss support set the `postcss` plugin option to
`'autoprefix'` if you only want autoprefixing (recommended), or `false` to fully disabled
any postcss processing.

## Custom Gatsby Style plugins and loaders

Gatsby CSS plugin also exports some utilities for building additional gatsby styling
plugins for other preprocessors. The tooling takes care of handling SSR as well as
css module support and any other gatsby specific things.

### `gatsby-node.js`

```js
const { createWebpackRule } = require('gatsby-plugin-css');

exports.onCreateWebpackConfig = (
  api,
  { postcssOptions, cssModulesOptions, ...sassOptions },
) => {
  const sassRule = Utils.createWebpackRule({
    test: /\.s(a|c)ss/,
    modulesTest: /\.module\.s(a|c)ss/,
    loader: {
      loader: require.resolve('sass-loader'),
      options: sassOptions,
    },

    // allow customizing the css modules settings
    cssModulesOptions,

    // support further post-processing with postcss
    postcss: true,
    postcssOptions,
    // pass gatsby plugin api
    api,
  });

  api.actions.setWebpackConfig({
    module: {
      rules: [sassRule],
    },
  });
};
```

THe above will create and return a webpack `oneOf` rule that matches sass and sass module
files. SSR is handled, and as a bonus users can add their own further post-processing
via postcss configuration (autoprefixing already taken care of).
