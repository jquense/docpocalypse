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

## What is wrong with Gatsby's built-in CSS support

Nothing particularly, but it's tied to major versions of Gatsby which
means that the tooling is OLD. This plugin can update css-loader and friends more frequently!
