const { webpack } = require('@webpack-utilities/test');

module.exports.webpack = (file, config) => {
  if (config.rules) return webpack(file, config);
  const { options, ...rest } = config.loader;

  return webpack(file, {
    ...config,
    rules: [
      {
        ...rest,
        use: {
          loader: require.resolve('../postcss-loader'),
          options,
        },
      },
    ],
  });
};
