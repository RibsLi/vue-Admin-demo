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

export function addCat(cat_pid, cat_name, cat_level) {
  return request({
    url: "categories",
    method: "post",
    data: {
      cat_pid,
      cat_name,
      cat_level
    }
  })
}