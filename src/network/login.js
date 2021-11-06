import request from "./request";

// 登录请求
export function login(username, password) {
  return request({
    url: "login",
    params: {
      username,
      password,
    },
  });
}
