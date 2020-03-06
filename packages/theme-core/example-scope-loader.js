const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const helpers = `
const d = (obj) => obj && obj.__esModule ? obj.default : obj;

const allValues = obj => {
  const keys = Object.keys(obj);
  return Promise.all(keys.map(k => obj[k])).then(values => {
    const next = {};
    keys.forEach((k, i) => {
      next[k] = values[i];
    });
    return next;
  });
};
\n
`;

const Imports = new Map();
const BaseModules = new Map();

function getEntry(loader) {
  // eslint-disable-next-line no-underscore-dangle
  const srcDir = path.join(loader._compiler.context, 'src');

  try {
    const entryFile = fs.readdirSync(srcDir).find(f => f.startsWith('entry'));

    return entryFile && path.join(srcDir, entryFile);
  } catch {
    return null;
  }
}

function exampleScopeLoader(src) {
  const { exampleCodeScope } = this.query || {};
  const resolve = promisify(this.resolve);
  const { emitError } = this;
  const entryFile = getEntry(this);

  // This file changes every time there is an update to imports
  // so it triggers a rebuild of the page
  this.addDependency(path.resolve('.cache/example-import-hash'));

  const done = this.async();

  async function toImports(imports, name) {
    const chunkName = `docpoc-${
      name === '/' ? 'root' : name.replace(/\/$/, '').replace(/\//g, '-')
    }`;

    const results = await Promise.all(
      imports.map(async i => {
        try {
          const file = await resolve(i.context, i.request);
          return `"${i.request}": import(/* webpackChunkName: "${chunkName}" */ '${file}')`;
        } catch (err) {
          emitError(
            new Error(
              `Docpocalypse Error: Import in example code block could not be resolved.\n\n` +
                `\timport request: "${i.request}" relative to "${i.context}"\n\n` +
                `Either the requested file doesn't exist, or webpack cannot resolve it.`,
            ),
          );
          return '';
        }
      }),
    );

    return results.join(',\n');
  }

  const process = async () => {
    const keys = await Promise.all(
      Array.from(Imports, async ([name, imports]) =>
        imports.length
          ? `'${name}': () => allValues({
    ${await toImports(imports, name)}
  }),`
          : '',
      ),
    );

    const entryRequire = entryFile ? `require('${entryFile}');\n` : '';

    const imports = `const IMPORTS = {\n${keys
      .filter(Boolean)
      .join('\n')}\n};\n`;

    const requires = exampleCodeScope
      ? `{\n${Object.entries(exampleCodeScope)
          .map(([ident, request]) => `"${ident}": d(require('${request}'))`)
          .join(',\n')}\n}`
      : 'null';

    const scope = `const SCOPE = ${requires};\n`;

    return `${entryRequire}${helpers}${scope}${imports}${src}`;
  };

  process().then(result => done(null, result), done);
}

module.exports = exampleScopeLoader;

module.exports.Imports = Imports;
module.exports.BaseModules = BaseModules;
