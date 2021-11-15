<template>
  <div class="params">
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="注意 ：只允许为第三级分类设置相关参数 ！"
        type="warning"
        show-icon
        :closable="false"
      ></el-alert>
      <!-- 分类级联选择器 -->
      <div style="margin: 15px 0">
        <p>
          选择商品分类 ：
          <el-cascader
            style="width: 30%"
            v-model="newCat"
            :options="allCatList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            placeholder="请选择"
            filterable
            @change="catChange"
          ></el-cascader>
        </p>
      </div>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isDisabled"
            @click="addParamsDialog = true"
            >添加动态参数</el-button
          >
          <!-- 列表信息 -->
          <el-table
            :data="paramsList"
            border
            height="57vh"
            highlight-current-row
            stripe
            style="width: 100%"
          >
            <!-- 参数列表扩展 -->
            <el-table-column type="expand" header-align="center" align="center">
              <template v-slot:default="tag">
                <el-tag
                  closable
                  v-for="(item, index) in tag.row.attr_vals"
                  :key="index"
                  @close="handleClose(index, tag.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  style="width: 100px"
                  size="small"
                  ref="saveTagInput"
                  v-if="tag.row.inputVisible"
                  v-model="tag.row.inputValue"
                  @keyup.enter="handleInputConfirm(tag.row)"
                  @blur="handleInputConfirm(tag.row)"
                >
                </el-input>
                <el-button
                  v-else
                  size="small"
                  style="width: 100px; margin-left: 10px"
                  @click="showInput(tag.row)"
                  >+ 新建标签</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="attr_name"
              label="参数名称"
              header-align="center"
            />
            <el-table-column label="操作" header-align="center" width="173px">
              <template v-slot:default="handle">
                <!-- 编辑按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="editClick(handle.row.attr_id)"
                ></el-button>
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="removeClick(handle.row.attr_id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isDisabled"
            @click="addParamsDialog = true"
            >添加静态属性</el-button
          >
          <!-- 列表信息 -->
          <el-table
            :data="paramsList"
            border
            height="58.8vh"
            highlight-current-row
            stripe
            style="width: 100%"
          >
            <!-- 参数列表扩展 -->
            <el-table-column type="expand" header-align="center" align="center">
              <template v-slot:default="tag">
                <el-tag
                  closable
                  v-for="(item, index) in tag.row.attr_vals"
                  :key="index"
                  @close="handleClose(index, tag.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  style="width: 100px"
                  size="small"
                  ref="saveTagInput"
                  v-if="tag.row.inputVisible"
                  v-model="tag.row.inputValue"
                  @keyup.enter="handleInputConfirm(tag.row)"
                  @blur="handleInputConfirm(tag.row)"
                >
                </el-input>
                <el-button
                  v-else
                  size="small"
                  style="width: 100px; margin-left: 10px"
                  @click="showInput(tag.row)"
                  >+ 新建标签</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="attr_name"
              label="参数名称"
              header-align="center"
            />
            <el-table-column label="操作" header-align="center" width="173px">
              <template v-slot:default="handle">
                <!-- 编辑按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="editClick(handle.row.attr_id)"
                ></el-button>
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="removeClick(handle.row.attr_id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态参数对话框 -->
    <el-dialog
      v-model="addParamsDialog"
      :title="'添加' + titleText"
      width="50%"
      :close-on-click-modal="false"
      @close="resetAddParamsForm"
    >
      <!-- 对话框内容 -->
      <el-form
        ref="addParams"
        :model="addParams"
        :rules="rules"
        label-width="80px"
        status-icon
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParams.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addParamsDialog = false">取消</el-button>
          <el-button type="primary" @click="submitAddParamsForm"
            >确认</el-button
          >
          <el-button type="warning" @click="resetAddParamsForm">
            重置
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog
      v-model="setParamsDialog"
      :title="'修改' + titleText"
      width="50%"
      :close-on-click-modal="false"
      @close="resetEditForm"
    >
      <!-- 对话框内容 -->
      <el-form
        ref="paramsInfo"
        :model="paramsInfo"
        :rules="rules"
        label-width="80px"
        status-icon
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="paramsInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setParamsDialog = false">取消</el-button>
          <el-button type="primary" @click="submitEditForm">确认</el-button>
          <el-button type="warning" @click="resetEditForm"> 重置 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCatList } from "network/categories";
import {
  getParams,
  addParams,
  getParamsInfo,
  setParams,
  deleteParams,
} from "network/params";

export default {
  name: "Params",
  data() {
    return {
      allCatList: [],
      newCat: [],
      activeName: "many",
      paramsList: [],
      isDisabled: true,
      addParamsDialog: false,
      addParams: {
        id: 0,
        attr_name: "",
        attr_sel: "",
        attr_vals: "",
      },
      setParamsDialog: false,
      paramsInfo: {},
      // inputVisible: false,
      // inputValue: '',
      rules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "参数名为2至10个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getCatList();
  },
  methods: {
    getCatList() {
      // 获取所有三级分类信息
      getCatList("3", "", "").then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("获取分类列表失败");
        this.allCatList = res.data.data;
      });
    },
    // 获取动态或静态参数
    getParams() {
      // 判断当前选中的分类是否有三级分类
      if (this.newCat.length == 0) {
        this.$message.warning("请先选择分类");
        this.paramsList = [];
      } else if (this.newCat.length == 3) {
        // 发起请求
        getParams(this.newCat[2], this.activeName).then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 200)
            return this.$message.error("获取参数数据失败");
          // 循环数据转换成数组以便后面tag使用
          res.data.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
            // 新建两个属性来控制tag的显示和value
            item.inputVisible = false;
            item.inputValue = "";
          });
          this.paramsList = res.data.data;
          this.isDisabled = false;
        });
      } else {
        this.$message.warning("当前分类下没有第三级分类");
        this.paramsList = [];
      }
    },
    // 级联选择器选择不同分类展示的数据
    catChange() {
      // console.log(this.newCat);
      this.getParams();
    },
    // 切换tab选项事件
    tabClick() {
      // console.log(this.activeName);
      this.getParams();
    },
    // 添加参数提交事件
    submitAddParamsForm() {
      this.$refs.addParams.validate((valid) => {
        if (valid) {
          addParams(
            this.newCat[2],
            this.addParams.attr_name,
            this.activeName,
            ""
          ).then((res) => {
            // console.log(res);
            if (res.data.meta.status !== 201) {
              return this.$message.error("添加参数失败");
            }
            this.addParamsDialog = false;
            // 添加成功后重新获取用户数据
            this.getParams();
            this.$message.success("添加参数成功");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 添加参数重置事件
    resetAddParamsForm() {
      this.$refs.addParams.resetFields();
    },
    // 编辑参数按钮点击事件
    editClick(attr_id) {
      getParamsInfo(this.newCat[2], attr_id, this.activeName, "").then(
        (res) => {
          // console.log(res);
          if (res.data.meta.status !== 200)
            return this.$message.error("获取参数信息失败");
          this.paramsInfo = res.data.data;
          this.setParamsDialog = true;
        }
      );
    },
    // 编辑按钮提交事件
    submitEditForm() {
      this.$refs.paramsInfo.validate((valid) => {
        if (valid) {
          setParams(
            this.newCat[2],
            this.paramsInfo.attr_id,
            this.paramsInfo.attr_name,
            this.activeName,
            ""
          ).then((res) => {
            // console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message.error("修改参数失败");
            }
            this.setParamsDialog = false;
            // 添加成功后重新获取用户数据
            this.getParams();
            this.$message.success("修改参数成功");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 编辑按钮重置事件
    resetEditForm() {
      this.$refs.paramsInfo.resetFields();
    },
    // 删除参数按钮点击事件
    removeClick(attr_id) {
      this.$confirm("确认删除此参数吗 ？", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteParams(this.newCat[2], attr_id).then((res) => {
            // console.log(res);
            if (res.data.meta.status !== 200)
              return this.$message.error("删除参数失败");
            this.$message.success("删除参数成功");
            this.getParams();
          });
        })
        .catch(() => {});
    },
    // 监听input输入框失去焦点事件
    handleInputConfirm(row) {
      // console.log(vis);
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false;
        row.inputValue = "";
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputVisible = false;
      row.inputValue = "";
      setParams(
        this.newCat[2],
        row.attr_id,
        row.attr_name,
        row.attr_sel,
        row.attr_vals.join(",")
      ).then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error("添加参数失败");
        }
        this.getParams();
        this.$message.success("添加参数成功");
      });
    },
    // 标签是否显示事件
    showInput(vis) {
      vis.inputVisible = true;
      // this.$nextTick(() => {
      //   this.$refs.saveTagInput.$refs.input.focus();
      // });
    },
    // 参数标签删除事件
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      setParams(
        this.newCat[2],
        row.attr_id,
        row.attr_name,
        row.attr_sel,
        row.attr_vals.join(",")
      ).then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error("添加参数失败");
        }
        this.getParams();
        this.$message.success("添加参数成功");
      });
    },
  },
  computed: {
    // 动态的决定添加参数对话框标题
    titleText() {
      if (this.activeName === "many") return "动态参数";
      return "静态属性";
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
</style>