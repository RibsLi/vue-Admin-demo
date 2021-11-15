import request from "./request";

// 请求报表数据
export function getReports() {
  return request({
    url: "reports/type/1",
    method: "get",
  });
}
