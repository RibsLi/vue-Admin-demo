import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import "assets/css/main.css";

// import axios from "axios"
// axios.defaults.baseURL = "https://lianghj.top:8888/api/private/v1/"

const app = createApp(App);
//vue3注册原型的方法
// app.config.globalProperties.$axios = axios;
app.use(store).use(router).use(ElementPlus).mount("#app");
