const { webpack } = require('../helpers');

xdescribe('Options', () => {
  test('Exec - {Boolean}', () => {
    const config = {
      loader: {
        test: /style\.(exec\.js|js)$/,
        options: {
          exec: true,
        },
      },
    };

    return webpack('jss/exec/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1];

      expect(source).toEqual('module.exports = "a {\\n    color: green\\n}"');

      expect(source).toMatchSnapshot();
    });
  });

  test('JSS - {String}', () => {
    const config = {
      loader: {
        test: /style\.js$/,
        options: {
          parser: 'postcss-js',
        },
      },
    };

    return webpack('jss/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1];

      expect(source).toMatchSnapshot();
    });
  });
});
