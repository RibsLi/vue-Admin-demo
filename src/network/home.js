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
export function getStateChange(userInfo) {
  return request({
    // url: "users/:uid/state/:type",
    url: `users/${userInfo.id}/state/${userInfo.mg_state}`,
    method: "put",
    // data: {
    //   uid,
    //   type
    // }
  })
}

// 添加用户请求
export function addUser(username, password, email, mobile) {
  return request({
    url: "users",
    method: "post",
    data: {
      username, 
      password, 
      email, 
      mobile
    }
  })
}