/* eslint-disable import/no-extraneous-dependencies */

const fs = require('fs');
const path = require('path');

const { rollup } = require('rollup');
const babel = require('rollup-plugin-babel');
const copy = require('rollup-plugin-copy');

const [outDir = './themes'] = process.argv.slice(2);

// const outDir = path.resolve(argv[0]);

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const root = path.resolve(__dirname, '../packages/prism-themes/src');

const themes = fs
  .readdirSync(root)
  .filter(f => !f.endsWith('.d.ts'))
  .map(input => {
    const name = path.basename(input, '.ts');
    const dir = `${outDir}/${name}`;

    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const packageJson = {
      name: `@themes/${name}`,
      private: true,
      sideEffects: false,
      main: 'index.cjs.js',
      module: 'index.js',
      types: 'index.d.ts',
      license: 'MIT',
    };

    fs.writeFileSync(
      path.join(outDir, name, 'package.json'),
      JSON.stringify(packageJson, undefined, 2),
    );

    return {
      input: `${root}/${input}`,
      output: [
        {
          file: path.join(outDir, name, 'index.cjs.js'),
          format: 'cjs',
        },
        {
          file: path.join(outDir, name, 'index.js'),
          format: 'esm',
        },
      ],
      plugins: [
        babel({
          rootMode: 'upward',
          envName: 'esm',
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        }),
        copy({
          targets: [
            {
              src: 'src/theme.d.ts',
              dest: dir,
              rename: 'index.d.ts',
            },
          ],
        }),
      ],
    };
  });

themes.map(async theme => {
  const bundle = await rollup(theme);

  await Promise.all(theme.output.map(bundle.write));
});
