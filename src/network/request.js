import axios from "axios";
// 请求时展示的进度条插件
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default function request(config) {
  const instance = axios.create({
    // baseURL: "http://127.0.0.1:8888/api/private/v1/",
    baseURL: "https://lianghj.top:8888/api/private/v1/",
    timeout: 5000,
    // method: "post"
  });
  //axios拦截器:请求拦截，响应拦截
  instance.interceptors.request.use(
    (config) => {
      // console.log(config);
      // 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌才有权限访问
      config.headers.Authorization = window.sessionStorage.getItem("token");
      NProgress.start();
      return config;
    },
    (err) => {
      console.log(err);
    }
  );
  //响应拦截
  instance.interceptors.response.use(
    (res) => {
      // console.log(res);
      NProgress.done()
      return res;
    },
    (err) => {
      console.log(err);
    }
  );
  return instance(config);
}
