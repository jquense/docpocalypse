const { webpack } = require('./helpers');

describe('Loader', () => {
  test('Default', () => {
    const config = {
      loader: {
        test: /\.css$/,
        options: {
          plugins: [(css) => css],
        },
      },
    };

    return webpack('css/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1];

      expect(source).toEqual('module.exports = "a { color: black }\\n"');
      expect(source).toMatchSnapshot();
    });
  });

  test('uses previous AST', () => {
    const spy = jest.fn();
    const config = {
      rules: [
        {
          test: /style\.js$/,
          use: [
            {
              loader: require.resolve('../postcss-loader'),
              options: { importLoaders: 1 },
            },
            {
              loader: require.resolve('./ast-loader'),
              options: { spy },
            },
          ],
        },
      ],
    };

    return webpack('jss/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1];

      expect(spy).toHaveBeenCalledTimes(1);
      expect(source).toMatchSnapshot();
    });
  });
});
