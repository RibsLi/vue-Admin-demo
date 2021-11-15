<template>
  <div class="rights">
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 列表信息 -->
      <el-table
        :data="rightsList"
        border
        height="80vh"
        highlight-current-row
        stripe
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="authName"
          label="权限名称"
          header-align="center"
          sortable
        />
        <el-table-column
          prop="path"
          label="路径"
          header-align="center"
          sortable
        />
        <el-table-column
          prop="level"
          label="权限等级"
          header-align="center"
          sortable
        >
          <template v-slot:default="tag">
            <el-tag v-if="tag.row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="tag.row.level == 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from "network/rights";
export default {
  name: "Rights",
  data() {
    return {
      rightsList: [],
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    // 获取权限列表数据
    getRightsList() {
      getRightsList("list").then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.success("获取用户权限列表失败");
        this.rightsList = res.data.data;
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>