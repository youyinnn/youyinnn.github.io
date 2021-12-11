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

module.exports = {
  // refer public path to dist folder
  // publicPath: "./dist",
  publicPath: process.env.NODE_ENV === "production" ? "/dist/" : "/",
  // make the index.html file place at the root of the repo
  indexPath: "../index.html",
  pluginOptions: {
    // webpackBundleAnalyzer: {
    //   openAnalyzer: false,
    // },
  },
  chainWebpack: (config) => {
    config.module.rule("raw-loader").test(/\.md$/).use("raw-loader");
    // config
    //   .plugin("webpack-bundle-analyzer")
    //   .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
    config.plugin("html").tap((args) => {
      // if (process.env.NODE_ENV === "production") {
      args[0].cdn = cdn;
      // }
      return args;
    });
    // 移除 prefetch 插件
    config.plugins.delete("prefetch");
    // 移除 preload 插件
    config.plugins.delete("preload");
    // config.resolve.alias.set("vue", "vue/dist/vue.esm-bundler.js");
  },
  configureWebpack: (config) => {
    // if (process.env.NODE_ENV === "production") {
    return { externals: externals };
    // }
  },
};
