/* eslint-disable no-unused-vars */
const externals = {
  vue: "Vue",
  "vue-router": "VueRouter",
  vuex: "Vuex",
};
const cdn = {
  css: [],
  js: [
    "https://cdn.jsdelivr.net/npm/vue@3.2.24/dist/vue.global.min.js",
    "https://cdn.jsdelivr.net/npm/vue-router@4.0.12/dist/vue-router.global.min.js",
    "https://cdn.jsdelivr.net/npm/vuex@4.0.2/dist/vuex.global.min.js",
  ],
};

const CompressionPlugin = require("compression-webpack-plugin");

process.env.VUE_APP_VALUE = "";

module.exports = {
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

    config.plugin("html").tap((args) => {
      if (process.env.NODE_ENV === "production") {
        args[0].cdn = cdn;
      }
      return args;
    });
  },

  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      return {
        externals: externals,
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
