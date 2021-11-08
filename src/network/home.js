import request from "./request";

// 请求菜单列表数据
export function getMenuList() {
  return request({
    url: "menus",
    method: "get"
  });
}

// 请求用户列表数据
export function getUsersList(query, pagenum, pagesize) {
  return request({
    url: "users",
    method: "get",
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}

// 请求用户状态的修改
export function getStateChange(uid, type) {
  return request({
    url: "users/:uId/state/:type",
    method: "put",
    params: {
      uid,
      type
    }
  })
}

// 添加用户请求
export function addUser(username, password, email, mobile) {
  return request({
    url: "users",
    method: "post",
    params: {
      username, 
      password, 
      email, 
      mobile
    }
  })
}