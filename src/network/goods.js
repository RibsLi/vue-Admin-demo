import request from "./request"

// 获取商品列表数据
export function getGoodsList(query, pagenum, pagesize) {
  return request({
    url: "goods",
    method: "get",
    params: {
      query, 
      pagenum, 
      pagesize
    }
  })
}
// 根据id查询商品信息
export function getGoodsInfo(id) {
  return request({
    url: `goods/${id}`,
    method: "get"
  })
}

// 删除商品请求
export function deleteGoods(id) {
  return request({
    url: `goods/${id}`,
    method: "delete"
  })
}