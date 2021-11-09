import request from "./request";

// 获取权限列表数据
export function getRightsList(key) {
  return request({
    url: `rights/${key}`,
    method: "get"
  })
}