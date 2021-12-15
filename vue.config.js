/* eslint-disable no-unused-vars */

const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  // refer public path to dist folder
  // publicPath: "./dist",
  publicPath: process.env.NODE_ENV === "production" ? "/dist/" : "/",
  // make the index.html file place at the root of the repo
  indexPath: "../index.html",
  runtimeCompiler: true,
  chainWebpack: (config) => {
    config.module.rule("raw-loader").test(/\.md$/).use("raw-loader");
    // config
    //   .plugin("webpack-bundle-analyzer")
    //   .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
    // 移除 prefetch 插件
    config.plugins.delete("prefetch");
    // 移除 preload 插件
    config.plugins.delete("preload");
  },

  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      return {
        plugins: [
          new CompressionPlugin({
            test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
            threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
            deleteOriginalAssets: false, // 是否删除原文件
          }),
        ],
      };
    } else {
      return {};
    }
  },
};
