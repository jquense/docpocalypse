/* eslint-disable import/no-extraneous-dependencies */
const { basename, dirname, extname, join } = require('path');

const yargs = require('yargs');
const fs = require('fs');
const glob = require('glob');

const traverse = require('astroturf/traverse').default;
const getNameFromFile = require('astroturf/utils/createFilename');

function createFilename(hostFile, { extension }, id) {
  let base;
  console.log('HERTE');
  if (getNameFromFile(hostFile) === id) base = id;
  else base = `${basename(hostFile, extname(hostFile))}-${id}`;

  return join(dirname(hostFile, '__generated__'), base + extension);
}

// eslint-disable-next-line no-unused-expressions
yargs.command(
  '$0 <src>',
  '',
  _ =>
    _.option('extension', {
      type: 'string'
    })
      .option('tag-name', {
        type: 'string'
      })
      .option('styled-tag', {
        type: 'string'
      })
      .option('custom-css-properties', {
        choices: [true, false, 'cssProp']
      })
      .option('css-prop', {
        type: 'bool'
      }),

  ({ src, cssProp, ...rest }) => {
    const files = glob.sync(`./${src}/**/*.{js,jsx,tsx,ts}`);
    // console.log(cssProp, rest);
    files.forEach(file => {
      const {
        metadata: { astroturf }
      } = traverse(fs.readFileSync(file, 'utf-8'), file, {
        ...rest,
        enableCssProp: cssProp,
        createFilename
      });

      // console.log(astroturf);
    });
  }
).argv;
