const path = require('path');
const fs = require('fs');
const latestVersion = require('latest-version');
const chalk = require('chalk');

let home;

try {
  home = require('os').homedir();
} catch (err) {
  /* ignore */
}

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

const templatePath = path.resolve(__dirname, './templates');

const dependencies = [
  'gatsby',
  '@docpocalypse/gatsby-theme',
  'react',
  'react-dom',
];

module.exports = plop => {
  plop.setHelper('eq', (a, b) => a === b);
  plop.setHelper('neq', (a, b) => a !== b);
  plop.setHelper('iff', (a, b, c) => (a ? b : c));
  plop.setHelper('year', () => new Date().getFullYear());

  const versions = allValues(
    dependencies.reduce(
      (acc, next) =>
        Object.assign(acc, {
          [next]: latestVersion(next),
        }),
      {},
    ),
  );

  const data = () => versions.then(v => ({ versions: v }));
  const cwd = process.cwd();

  const prompts = [
    {
      name: 'location',
      type: 'input',
      message: 'package location',
      filter: location =>
        path.isAbsolute(location) ? location : path.resolve(location),
    },
    {
      name: 'src',
      type: 'input',
      message: () => {
        return `source files directory (relative to: ${chalk.cyan(
          home ? cwd.replace(home, '~') : cwd,
        )})?`;
      },
      // validate: src =>
      //   fs.existsSync(src) || `${chalk.bold(src)} isn't a valid path`,
      filter: src =>
        (path.isAbsolute(src) ? src : path.resolve(cwd, src)).trim(),
    },
  ];

  // controller generator
  plop.setGenerator('new-doc-site', {
    description: 'create a new package',
    prompts,
    actions() {
      return [
        {
          type: 'add',
          path: '{{location}}/src/pages/index.js',
          templateFile: `${templatePath}/index.js`,
        },
        {
          type: 'add',
          path: '{{location}}/src/examples/.gitkeep',
        },
        {
          type: 'add',
          path:
            '{{location}}/src/@docpocalypse/gatsby-theme/components/.gitkeep',
        },
        {
          data,
          type: 'add',
          path: '{{location}}/package.json.hbs',
          templateFile: `${templatePath}/package.json`,
        },
        {
          type: 'add',
          path: '{{location}}/gatsby-config.js',
          templateFile: `${templatePath}/gatsby-config.js`,
        },
        {
          type: 'add',
          path: '{{location}}/gatsby-node.js',
          templateFile: `${templatePath}/gatsby-node.js`,
        },
      ].filter(Boolean);
    },
  });
};
