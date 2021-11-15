<template>
  <div class="orders">
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索框和添加用户 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            placeholder="请输入搜索内容"
            v-model="query"
            clearable
            @clear="getOrdersList"
            @keyup.enter="searchClick"
          >
            <template #append>
              <el-button icon="el-icon-search" @click="searchClick"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <!-- 列表信息 -->
      <el-table
        :data="ordersList"
        border
        stripe
        height="69.7vh"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="order_number"
          label="订单编号"
          header-align="center"
          sortable
        />
        <el-table-column
          prop="order_price"
          label="订单价格"
          header-align="center"
          sortable
        />
        <el-table-column
          prop="order_pay"
          label="是否支付"
          header-align="center"
          sortable
        >
          <template v-slot:default="scope">
            <el-tag
              type="success"
              effect="dark"
              v-if="scope.row.pay_status == 1"
              >已付款</el-tag
            >
            <el-tag type="warning" effect="dark" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          header-align="center"
          sortable
        />
        <el-table-column
          prop="create_time"
          label="下单时间"
          header-align="center"
          sortable
        >
          <template v-slot:default="scope">
            {{ commentData(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" width="173px">
          <template v-slot:default="handle">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editClick(handle.row)"
            ></el-button>
            <!-- 物流按钮 -->
            <el-button
              type="success"
              icon="el-icon-location-information"
              size="small"
              @click="logisticsClick(handle.row)"
            ></el-button>
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
    <!-- 订单编辑对话框 -->
    <el-dialog
      v-model="editDialog"
      title="修改地址"
      width="50%"
      :close-on-click-modal="false"
      @close="resetEditForm"
    >
      <!-- 对话框内容 -->
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="rules"
        label-width="90px"
        status-icon
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            placeholder="请选择"
            filterable
            v-model="editForm.address1"
            :props="{ expandTrigger: 'hover' }"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialog = false">取消</el-button>
          <el-button type="primary" @click="submitEditForm">确认</el-button>
          <el-button type="warning" @click="resetEditForm"> 重置 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 物流对话框 -->
    <el-dialog
      v-model="logisticsDialog"
      title="物流信息"
      width="50%"
      :close-on-click-modal="false"
    >
      <!-- 对话框内容 -->
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in logisticsInfo"
          :key="index"
          :timestamp="item.time"
          reverse="reverse"
          type="primary"
          :hollow="true"
        >
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrdersList, getLogistics } from "network/orders";
import { formatDate } from "common/utils";
import cityData from "common/citydata";

export default {
  name: "Orders",
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 10,
      total: 0,
      ordersList: [],
      editDialog: false,
      editForm: {
        address1: [],
        address2: "",
      },
      cityData,
      logisticsDialog: false,
      logisticsInfo: [],
      rules: {
        address1: [
          {
            required: true,
            message: "请选择地区",
            trigger: "blur",
          },
        ],
        address2: [
          {
            required: true,
            message: "请输入您的详细地址",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    // 获取订单列表数据
    getOrdersList() {
      getOrdersList(this.query, this.pagenum, this.pagesize).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("获取订单列表失败");
        this.ordersList = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },
    // 切换每页显示多少条数据时执行的事件
    handleSizeChange(newSize) {
      this.pagesize = newSize;
      this.getOrdersList();
    },
    // 页码改变时执行的事件
    handleCurrentChange(newPage) {
      this.pagenum = newPage;
      this.getOrdersList();
    },
    // 判断搜索内容是否为空，若为空则不发起请求
    searchClick() {
      if (this.query == "") return this.$message.warning("请输入搜索内容");
      this.getOrdersList();
    },
    // 时间处理函数
    commentData(create_time) {
      const data = new Date(create_time * 1000);
      return formatDate(data, "yyyy-MM-dd hh:mm:ss");
    },
    // 订单编辑按钮点击事件
    editClick() {
      this.editDialog = true;
    },
    // 编辑按钮提交事件
    submitEditForm() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.editDialog = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 编辑按钮重置事件
    resetEditForm() {
      this.$refs.editForm.resetFields();
    },
    // 物流点击事件
    logisticsClick() {
      this.logisticsDialog = true;
      getLogistics("1106975712662").then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("获取物流信息失败");
        this.logisticsInfo = res.data.data;
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>