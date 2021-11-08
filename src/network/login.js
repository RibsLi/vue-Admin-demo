import request from "./request";

// 登录请求
export function login(username, password) {
  return request({
    url: "login",
    method: "post",
    params: {
      username,
      password,
    },
  });
}
