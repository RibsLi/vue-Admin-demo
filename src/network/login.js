import request from "./request";

export function login(loginForm) {
  return request({
    url: "login",
    params: {
      loginForm
    }
  })
}