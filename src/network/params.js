import request from "./request"

// 获取动态或静态参数
export function getParams(id, sel) {
  return request({
    url: `categories/${id}/attributes`,
    method: "get",
    params: {
      sel
    }
  })
}
// 添加动态或者静态参数
export function addParams(id, attr_name, attr_sel, attr_vals) {
  return request({
    url: `categories/${id}/attributes`,
    method: "post",
    data: {
      attr_name,
      attr_sel,
      attr_vals
    }
  })
}
// 根据id查询参数信息
export function getParamsInfo(id, attrId, attr_sel, attr_vals) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: "get",
    params: {
      attr_sel,
      attr_vals
    }
  })
}
// 编辑提交参数请求
export function setParams(id, attrId, attr_name, attr_sel, attr_vals) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: "put",
    data: {
      attr_name,
      attr_sel,
      attr_vals
    }
  })
}
// 删除参数
export function deleteParams(id, attrId) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: "delete"
  })
}