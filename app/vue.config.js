const dotenv = require('dotenv').config({ path: '../.env' })
require('dotenv-expand').expand(dotenv);

/* eslint-disable no-undef */
// vue.config.js
module.exports = {
  runtimeCompiler: true,
  publicPath: "/",
    // process.env.NODE_ENV === "production" ? "/emailer/app/dist/" : "/",
  devServer: {
    port: 3000,
    // proxy: 'http://localhost:4040'
    // proxy: {
    //   target: "http://localhost:4040",
    //   ws: true,
    //   changeOrigin: true,
    // }
  },
  css: {
    requireModuleExtension: true,
    loaderOptions: {
      sass: {
        data: `@import "@/assets/_app.scss";`
      }
    }
  },
  pwa: {
    name: "Emailer",
    themeColor: "#2E22FF",
    msTileColor: "#2E22FF",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black-translucent"
  }
};
