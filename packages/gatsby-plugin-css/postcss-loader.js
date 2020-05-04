const path = require('path');

const { getOptions } = require('loader-utils');
const postcss = require('postcss');
const postcssrc = require('postcss-load-config');
const postcssPkg = require('postcss/package.json');
const satisfies = require('semver/functions/satisfies');

function createLoader(fn) {
  const overrides = fn ? fn(postcss) : undefined;

  return function customPostcssLoader(source, inputMap, meta) {
    // Make the loader async
    const callback = this.async();

    // eslint-disable-next-line no-use-before-define
    postcssLoader.call(this, source, inputMap, meta, overrides).then(
      (args) => callback(null, ...args),
      (err) => callback(err),
    );
  };
}

function getProgrammaticOptions({ parser, syntax, stringifier, plugins }) {
  if (typeof plugins === 'function') {
    plugins = plugins(this);
  }
  if (plugins == null) {
    plugins = [];
  } else if (!Array.isArray(plugins)) {
    plugins = [plugins];
  }

  if (!parser && !syntax && !stringifier) {
    return { plugins };
  }

  return {
    file: null,
    plugins,
    options: {
      parser,
      syntax,
      stringifier,
    },
  };
}

async function postcssLoader(source, inputMap, meta, overrides = {}) {
  const file = this.resourcePath;

  let inputAst = null;
  if (
    meta &&
    meta.ast &&
    meta.ast.type === 'postcss' &&
    satisfies(meta.ast.version, `^${postcssPkg.version}`)
  ) {
    inputAst = meta.ast.root;
  }

  let loaderOptions = getOptions(this) || {};

  let customOptions;
  if (overrides && overrides.customOptions) {
    const result = await overrides.customOptions.call(this, loaderOptions, {
      source,
      inputAst,
      inputMap,
    });

    customOptions = result.custom;
    loaderOptions = result.loader;
  }

  const { sourceMap } = loaderOptions;

  const getConfig = async () => {
    const programmaticOptions = getProgrammaticOptions(loaderOptions);
    const hasOptions =
      programmaticOptions.plugins.length || programmaticOptions.options;

    if (hasOptions || loaderOptions.config === false) {
      return programmaticOptions;
    }

    let filePath = path.dirname(file);
    const ctx = {
      file: {
        extname: path.extname(file),
        dirname: path.dirname(file),
        basename: path.basename(file),
      },
      options: {},
    };

    if (loaderOptions.config) {
      if (loaderOptions.config.path) {
        filePath = path.resolve(loaderOptions.config.path);
      }
      if (loaderOptions.config.ctx) {
        ctx.loaderOptions = loaderOptions.config.ctx;
      }
    }

    ctx.webpack = this;

    let config = await postcssrc(ctx, filePath);

    if (typeof loaderOptions.config === 'function') {
      config = await loaderOptions.config.call(this, config, {
        source,
        inputMap,
        inputAst,
      });
    }

    if (config.file) {
      this.addDependency(config.file);
    }
    return config;
  };

  let config = await getConfig();

  if (overrides.config) {
    config = await overrides.config.call(this, config, {
      source,
      inputMap,
      inputAst,
      customOptions,
    });
  }

  const options = {
    // eslint-disable-next-line no-nested-ternary
    map: sourceMap
      ? sourceMap === 'inline'
        ? { inline: true, annotation: false }
        : { inline: false, annotation: false }
      : false,

    ...config.options,
    from: file,
  };

  delete options.to;

  if (sourceMap && typeof inputMap === 'string') {
    inputMap = JSON.parse(inputMap);
  }

  if (sourceMap && inputMap && options.map) {
    options.map.prev = inputMap;
  }

  const content = inputAst || source;

  let result = await postcss(config.plugins).process(content, options);

  if (overrides.result) {
    result = await overrides.result.call(this, result, {
      source,
      inputMap,
      inputAst,
      customOptions,
    });
  }

  let { css, map, root, processor, messages } = result;

  messages.forEach((msg) => {
    if (msg.type === 'dependency') {
      this.addDependency(msg.file);
    }
  });

  map = map ? map.toJSON() : null;

  if (map) {
    map.file = path.resolve(map.file);
    map.sources = map.sources.map((src) => path.resolve(src));
  }

  if (!meta) meta = {};

  const ast = {
    type: 'postcss',
    version: processor.version,
    root,
  };

  meta.ast = ast;
  meta.messages = messages;

  return [css, map, meta];
}

module.exports = createLoader();
module.exports.custom = createLoader;
