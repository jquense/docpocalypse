// const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const { promisify } = require('util');

const helpers = `
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

function exampleScopeLoader(src) {
  const resolve = promisify(this.resolve);

  const done = this.async();

  async function toImports(imports, name) {
    const results = await Promise.all(
      imports.map(async i => {
        const file = await resolve(i.context, i.request);
        return `"${i.request}": import(/* webpackChunkName: "${name}" */ '${file}')`;
      })
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
          : ''
      )
    );
    const imports = `const IMPORTS = {\n${keys.join('\n')}\n};\n`;

    return `${helpers}${imports}${src}`;
  };

  process().then(result => done(null, result), done);
}

module.exports = exampleScopeLoader;
module.exports.Imports = Imports;
