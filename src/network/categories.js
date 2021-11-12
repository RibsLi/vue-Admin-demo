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

// 添加分类请求
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
// 根据id获取分类信息
export function getCatInfo(id) {
  return request({
    url: `categories/${id}`,
    method: "get"
  })
}
// 编辑分类提交请求
export function setCat(id, cat_name) {
  return request({
    url: `categories/${id}`,
    method: "put",
    data: {
      cat_name
    }
  })
}
// 删除分类请求
export function deleteCat(id) {
  return request({
    url: `categories/${id}`,
    method: "delete"
  })
}