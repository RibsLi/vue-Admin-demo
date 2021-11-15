module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        assets: "@/assets",
        common: "@/common",
        components: "@/components",
        network: "@/network",
        views: "@/views",
      },
    },
  },
  // 自定义打包路径
  // 发布模式
  chainWebpack: (config) => {
    config.when(process.env.NODE_ENV === "production", (config) => {
      config.entry("app").clear().add("./src/main-prod.js");
    });

    // 开发模式
    config.when(process.env.NODE_ENV === "development", (config) => {
      config.entry("app").clear().add("./src/main-dev.js");
    });
  },
};
