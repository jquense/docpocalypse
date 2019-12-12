const path = require('path');

const templatePath = path.resolve(__dirname, './templates');

const prompts = [
  {
    name: 'location',
    type: 'input',
    message: 'package location',
    filter: location =>
      path.isAbsolute(location) ? location : path.resolve(location)
  },
  {
    name: 'src',
    type: 'input',
    message: 'Where are the files?',
    filter: (src, { location }) =>
      (path.isAbsolute(src) ? src : path.resolve(location, src)).trim()
  }
];

module.exports = plop => {
  plop.setHelper('eq', (a, b) => a === b);
  plop.setHelper('neq', (a, b) => a !== b);
  plop.setHelper('iff', (a, b, c) => (a ? b : c));
  plop.setHelper('year', () => new Date().getFullYear());

  // controller generator
  plop.setGenerator('new-doc-site', {
    description: 'create a new package',
    prompts,
    actions() {
      return [
        {
          type: 'add',
          path: '{{location}}/src/pages/index.js',
          templateFile: `${templatePath}/index.js`
        },
        {
          type: 'add',
          path: '{{location}}/src/examples/.gitkeep'
        },
        {
          type: 'add',
          path:
            '{{location}}/src/@docpocalypse/gatsby-theme/components/.gitkeep'
        },
        {
          type: 'add',
          path: '{{location}}/package.json',
          templateFile: `${templatePath}/package.json`
        },
        {
          type: 'add',
          path: '{{location}}/gatsby-config.js',
          templateFile: `${templatePath}/gatsby-config.js`
        }
      ].filter(Boolean);
    }
  });
};
