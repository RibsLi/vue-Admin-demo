import request from "./request"

//请求订单列表
export function getOrdersList(
  query,
  pagenum,
  pagesize,
  user_id,
  pay_status,
  is_send,
  order_fapiao_title,
  order_fapiao_company,
  order_fapiao_content,
  consignee_addr) {
  return request({
    url: "orders",
    method: "get",
    params: {
      query,
      pagenum,
      pagesize,
      user_id,
      pay_status,
      is_send,
      order_fapiao_title,
      order_fapiao_company,
      order_fapiao_content,
      consignee_addr,
    }
  })
}
// 查看物流信息
export function getLogistics(id) {
  return request({
    url: `kuaidi/${id}`,
    method: "get"
  })
}