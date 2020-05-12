module.exports = (ctx) => ({
  plugins: [ctx.options.plugin ? require('./plugin')() : (css) => css],
});
