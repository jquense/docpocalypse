const { webpack } = require('../helpers');

describe('Options', () => {
  test('Parser - {String}', () => {
    const config = {
      rules: [
        {
          test: /\.sss$/,
          use: {
            loader: require.resolve('../../postcss-loader'),
            options: {
              parser: 'sugarss',
            },
          },
        },
      ],
    };

    return webpack('sss/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1];

      expect(source).toEqual('module.exports = "a {\\n  color: black\\n}\\n"');
      expect(source).toMatchSnapshot();
    });
  });

  test('Parser - {Object}', () => {
    const config = {
      loader: {
        test: /\.sss$/,
        options: {
          ident: 'postcss',
          parser: require('sugarss'),
        },
      },
    };

    return webpack('sss/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1];

      expect(source).toEqual('module.exports = "a {\\n  color: black\\n}\\n"');
      expect(source).toMatchSnapshot();
    });
  });
});
