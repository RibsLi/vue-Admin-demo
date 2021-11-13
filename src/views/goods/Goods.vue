<template>
  <div class="goods">
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索框和添加商品 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入搜索内容" v-model="query" clearable @clear="getGoodsList" @keyup.enter="searchClick">
            <template #append>
              <el-button icon="el-icon-search" @click="searchClick"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 列表信息 -->
      <el-table :data="goodsList" border stripe height="69.7vh" highlight-current-row style="width: 100%">
        <el-table-column type="index" label="序号" header-align="center" align="center" />
        <el-table-column prop="goods_name" label="商品名称" header-align="center" sortable />
        <el-table-column prop="goods_price" label="价格（元）" header-align="center" sortable />
        <el-table-column prop="goods_weight" label="商品重量" header-align="center" sortable />
        <el-table-column prop="add_time" label="创建时间" header-align="center" sortable>
          <template v-slot:default="scope">
            {{commentData(scope.row.add_time)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" width="173px">
          <template v-slot:default="handle">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="small" @click="editClick(handle.row.goods_id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="small" @click="removeClick(handle.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        v-model:currentPage="pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList, deleteGoods, getGoodsInfo } from "network/goods"
import { formatDate } from "common/utils";

export default {
  name: "Goods",
  data() {
    return {
      query: '',
      pagenum: 1, 
      pagesize: 10,
      goodsList: [],
      total: 0,
      goodsInfo: {},
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表数据失败
    getGoodsList() {
      getGoodsList(this.query, this.pagenum, this.pagesize).then(res => {
        // console.log(res);
        if(res.data.meta.status !== 200) return this.$message.error('获取商品列表数据失败')
        this.goodsList = res.data.data.goods
        this.total = res.data.data.total
      })
    },
    // 切换每页显示多少条数据时执行的事件
    handleSizeChange(newSize) {
      this.pagesize = newSize
      this.getGoodsList()
    },
    // 页码改变时执行的事件
    handleCurrentChange(newPage) {
      this.pagenum = newPage
      this.getGoodsList()
    },
    // 判断搜索内容是否为空，若为空则不发起请求
    searchClick() {
      if(this.query == '') return this.$message.warning('请输入搜索内容')
      this.getGoodsList()
    },
    // 商品编辑点击事件
    editClick(id) {
      getGoodsInfo(id).then(res => {
        console.log(res);
        if(res.data.meta.status !== 200) return this.$message.error('获取商品信息失败')
        this.goodsInfo = res.data.data
      })
    },
    // 删除商品事件
    removeClick(id) {
      this.$confirm(
        '确认删除此商品吗 ？',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        deleteGoods(id).then(res => {
          // console.log(res);
          if (res.data.meta.status !== 200) return this.$message.error('删除商品失败')
          this.$message.success('删除商品成功')
          this.getGoodsList()
        })
      }).catch(() => {})
    },
    // 时间处理函数
    commentData(add_time) {
      const data = new Date(add_time * 1000);
      return formatDate(data, "yyyy-MM-dd hh:mm:ss");
    },
    // 添加商品点击事件
    addGoods() {
      this.$router.push('/addGoods')
    }
  }
}
</script>

<style lang="less" scoped>

</style>