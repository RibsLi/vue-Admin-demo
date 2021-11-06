import axios from 'axios'

export default function request(config) {
  const instance = axios.create({
    baseURL: "http://127.0.0.1:8888/api/private/v1/",
    timeout: 5000,
    method: "post"
  })
  //axios拦截器:请求拦截，响应拦截
  instance.interceptors.request.use(
    config => {
      // console.log(config);
      return config;
    },
    err => {
      console.log(err);
    }
  );
  //响应拦截
  instance.interceptors.response.use(
    res => {
      // console.log(res);
      return res;
    },
    err => {
      console.log(err);
    }
  );
  return instance(config)
}