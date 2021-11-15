<template>
  <div class="reports">
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 报表 -->
    <el-card>
      <div id="main"></div>
    </el-card>
  </div>
</template>

<script>
import { getReports } from "network/reports";
import * as echarts from "echarts";
import _ from "lodash";

export default {
  name: "Reports",
  data() {
    return {
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  mounted() {
    getReports().then((res) => {
      // console.log(res);
      if (res.data.meta.status !== 200)
        return this.$message.error("获取数据报表失败");
      var myChart = echarts.init(document.getElementById("main"));
      // 使用lodash合并两个数据
      const result = _.merge(res.data.data, this.options);
      myChart.setOption(result);
    });
  },
};
</script>

<style lang="less" scoped>
#main {
  width: 700px;
  height: 400px;
}
</style>