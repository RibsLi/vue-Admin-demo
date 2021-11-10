import request from "./request";

// 请求商品分类列表
export function getCatList(type, pagenum, pagesize) {
  return request({
    url: "categories",
    method: "get",
    params: {
      type,
      pagenum,
      pagesize
    }
  })
}