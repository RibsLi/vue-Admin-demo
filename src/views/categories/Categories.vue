<template>
  <div class="categories">
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="addCatClick">添加分类</el-button>
      <!-- 列表信息 -->
      <el-table :data="catList" border row-key="cat_id" height="69.7vh" highlight-current-row empty-text="Loading..." style="width: 100%">
        <!-- <el-table-column type="expand" header-align="center" align="center"/> -->
        <!-- <el-table-column type="index" label="序号" header-align="center" align="center" /> -->
        <el-table-column prop="cat_name" label="分类名称" header-align="center" />
        <el-table-column prop="cat_deleted" label="是否有效" header-align="center">
          <template v-slot:default="state">
            <i class="el-icon-circle-check" style="color: lightgreen; font-size:20px" v-if="state.row.cat_deleted===false"></i>
            <i class="el-icon-error" style="color: red; font-size:20px" v-else></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="分类等级" header-align="center">
          <template v-slot:default="tag">
            <el-tag v-if="tag.row.cat_level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="tag.row.cat_level == 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" width="173px">
          <template v-slot:default="handle">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="small" @click="editClick(handle.row)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="small" @click="removeClick(handle.row.cat_id)"></el-button>
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
    <!-- 添加分类对话框 -->
    <el-dialog
      v-model="addCatDialog"
      title="添加分类"
      width="50%"
      :close-on-click-modal="false"
      @close="resetAddCatForm"
    >
    <!-- 对话框内容 -->
      <el-form
        ref="addCatForm"
        :model="addCatForm"
        :rules="rules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            style="width:100%"
            v-model="newCat"
            :options="catList_tow"
            :props="{ checkStrictly: true, expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children'}"
            placeholder="请选择"
            clearable
            filterable
            @change="addCatChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCatDialog = false">取消</el-button>
          <el-button type="primary" @click="submitAddCatForm"
            >确认</el-button
          >
          <el-button type="warning" @click="resetAddCatForm">
            重置
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      v-model="editDialog"
      title="修改分类"
      width="50%"
      :close-on-click-modal="false"
      @close="resetEditForm"
    >
    <!-- 对话框内容 -->
      <el-form
        ref="catInfo"
        :model="catInfo"
        :rules="rules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="catInfo.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialog = false">取消</el-button>
          <el-button type="primary" @click="submitEditForm"
            >确认</el-button
          >
          <el-button type="warning" @click="resetEditForm">
            重置
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCatList, addCat, getCatInfo, setCat, deleteCat } from "network/categories"

export default {
  name: "Categories",
  data() {
    return {
      type: 3,
      pagenum: 1,
      pagesize: 10,
      catList: [],
      total: 0,
      addCatDialog: false,
      addCatForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      catList_tow: [],
      newCat: [],
      catInfo: {},
      editDialog: false,
      rules: {
        cat_name: [
          {
            required: true,
            message: "请输入角色名",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "角色名为2至10个字符",
            trigger: "blur",
          },
        ]
      }
    }
  },
  created() {
    this.getCatList()
  },
  methods: {
    // 请求分类列表数据
    getCatList() {
      getCatList(this.type, this.pagenum, this.pagesize).then(res => {
        // console.log(res);
        if(res.data.meta.status !== 200) return this.$message.error('获取分类列表失败')
        this.catList = res.data.data.result
        this.total = res.data.data.total
      })
    },
    // 切换每页显示多少条数据时执行的事件
    handleSizeChange(newSize) {
      this.pagesize = newSize
      this.getCatList()
    },
    // 页码改变时执行的事件
    handleCurrentChange(newPage) {
      this.pagenum = newPage
      this.getCatList()
    },
    // 添加分类点击事件
    addCatClick() {
      // 获取所有二级分类数据
      getCatList('2', '', '').then(res => {
        // console.log(res);
        if(res.data.meta.status !== 200) return this.$message.error('获取分类列表失败')
        this.catList_tow = res.data.data
        this.addCatDialog = true
      })
    },
    // 添加分类级联选择器节点变化事件
    addCatChange() {
      // console.log(this.newCat);
      if(this.newCat.length > 0) {
        this.addCatForm.cat_pid = this.newCat[this.newCat.length - 1]
        this.addCatForm.cat_level = this.newCat.length
      } else {
        this.addCatForm.cat_pid = 0
        this.addCatForm.cat_level = 0
      }
    },
    // 添加分类提交事件
    submitAddCatForm() {
      // console.log(this.addCatForm);
      this.$refs.addCatForm.validate((valid) => {
        if (valid) {
          addCat(this.addCatForm.cat_pid, this.addCatForm.cat_name, this.addCatForm.cat_level).then(res => {
            console.log(res);
            if (res.data.meta.status !== 201) {
              return this.$message.error('添加分类失败')
            }
            this.addCatDialog = false
            // 添加成功后重新获取用户数据
            this.getCatList()
            this.$message.success('添加分类成功')
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    },
    // 添加分类对话框重置事件
    resetAddCatForm() {
      this.$refs.addCatForm.resetFields();
      this.newCat = []
    },
    // 编辑分类点击事件
    editClick(catInfo) {
      getCatInfo(catInfo.cat_id).then(res => {
        console.log(res);
        if(res.data.meta.status !== 200) return this.$message.error('获取分类信息失败')
        this.catInfo = res.data.data
        this.editDialog =true
      })
    },
    // 编辑分类提交请求
    submitEditForm() {
      this.$refs.catInfo.validate((valid) => {
        if (valid) {
          setCat(this.catInfo.cat_id, this.catInfo.cat_name).then(res => {
            console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message.error('修改分类失败')
            }
            this.editDialog = false
            // 添加成功后重新获取用户数据
            this.getCatList()
            this.$message.success('修改分类成功')
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    },
    // 编辑分类重置事件
    resetEditForm() {
      this.$refs.catInfo.resetFields();
    },
    // 删除分类
    removeClick(id) {
      this.$confirm(
        '确认删除此分类吗 ？',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        deleteCat(id).then(res => {
          // console.log(res);
          if (res.data.meta.status !== 200) return this.$message.error('删除分类失败')
          this.$message.success('删除分类成功')
          this.getCatList()
        })
      }).catch(() => {})
    },
  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
</style>