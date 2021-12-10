module.exports = {
  // refer public path to dist folder
  // publicPath: "./dist",
  publicPath: "/dist/",
  // make the index.html file place at the root of the repo
  indexPath: "../index.html",
  pluginOptions: {},
  chainWebpack: (config) => {
    // GraphQL Loader
    config.module.rule("raw-loader").test(/\.md$/).use("raw-loader");
  },
};
