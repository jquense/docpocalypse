const nodePlop = require('node-plop');
const yargs = require('yargs');
// load an instance of plop from a plopfile

exports.command = '$0 [location]';

exports.describe = 'create a new docpocalypse site';

exports.builder = _ =>
  _.positional('location', {
    type: 'string',
    default: process.cwd(),
    describe: 'the location of the package',
    normalize: true
  });

exports.handler = async ({ location }) => {
  const plop = nodePlop(`${__dirname}/plopfile.js`);
  const newPkg = plop.getGenerator('new-doc-site');

  const answers = await newPkg.runPrompts([location]);
  const result = await newPkg.runActions(answers);
  if (result.failures) {
    result.failures.forEach(
      f =>
        f.error &&
        !f.error.startsWith('Aborted due to previous') &&
        console.error(f.error)
    );
  }
};

// eslint-disable-next-line no-underscore-dangle
const _a = yargs.command(
  '$0 [location]',
  'create a new docpocalypse site',
  _ =>
    _.positional('location', {
      type: 'string',
      default: process.cwd(),
      describe: 'the location of the package',
      normalize: true
    }),
  async ({ location }) => {
    const plop = nodePlop(`${__dirname}/plopfile.js`);
    const newPkg = plop.getGenerator('new-doc-site');

    const answers = await newPkg.runPrompts([location]);
    const result = await newPkg.runActions(answers);
    if (result.failures) {
      result.failures.forEach(
        f =>
          f.error &&
          !f.error.startsWith('Aborted due to previous') &&
          console.error(f.error)
      );
    }
  }
).argv;
