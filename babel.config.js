// 判断当前环境来决定是否使用插件删除console.log
const prodPlugins = [];
if (process.env.NODE_ENV === "production") {
  prodPlugins.push("transform-remove-console");
}

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  
  plugins: [
    // 发布产品时的插件
    ...prodPlugins,
  ],
};
