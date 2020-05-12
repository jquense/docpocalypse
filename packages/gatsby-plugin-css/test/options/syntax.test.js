const { webpack } = require('../helpers');

describe('Options', () => {
  test('Syntax - {String}', () => {
    const config = {
      loader: {
        test: /\.sss$/,
        options: {
          syntax: 'sugarss',
        },
      },
    };

    return webpack('sss/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1];

      expect(source).toEqual('module.exports = "a\\n  color: black\\n"');
      expect(source).toMatchSnapshot();
    });
  });

  test('Syntax - {Object}', () => {
    const config = {
      loader: {
        test: /\.sss$/,
        options: {
          ident: 'postcss',
          syntax: require('sugarss'),
        },
      },
    };

    return webpack('sss/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1];

      expect(source).toEqual('module.exports = "a\\n  color: black\\n"');
      expect(source).toMatchSnapshot();
    });
  });
});
