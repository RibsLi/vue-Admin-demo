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
//添加商品
export function addGoods(goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs) {
  return request({
    url: "goods",
    method: "post",
    data: {
      goods_name,
      goods_cat,
      goods_price,
      goods_number,
      goods_weight,
      goods_introduce,
      pics,
      attrs
    }
  })
}
// 编辑提交商品
export function setGoods(id, goods_name, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs, goods_cat) {
  return request({
    url: `goods/${id}`,
    method: "put",
    data: {
      goods_name,
      goods_price,
      goods_number,
      goods_weight,
      goods_introduce,
      pics,
      attrs,
      goods_cat
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