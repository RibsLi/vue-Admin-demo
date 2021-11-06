import request from "./request";

// 请求菜单列表数据
export function getMenuList() {
  return request({
    url: "menus",
  });
}
