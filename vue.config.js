module.exports = {
  publicPath: "./",
  outputDir: "docs",
  pluginOptions: {},
  chainWebpack: (config) => {
    // GraphQL Loader
    config.module.rule("raw-loader").test(/\.md$/).use("raw-loader");
  },
};
