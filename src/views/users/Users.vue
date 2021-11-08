<template>
  <div class="users">
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索框和添加用户 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入搜索内容" v-model="query" clearable @clear="getUsersList" @keyup.enter="getUsersList">
            <template #append>
              <el-button icon="el-icon-search" @click="getUsersList"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 列表信息 -->
      <el-table :data="usersList" border height="71vh" highlight-current-row style="width: 100%">
        <el-table-column type="index" label="序号" header-align="center" align="center" />
        <el-table-column prop="username" label="姓名" header-align="center" />
        <el-table-column prop="email" label="邮箱" header-align="center" />
        <el-table-column prop="mobile" label="电话" header-align="center" />
        <el-table-column prop="role_name" label="角色" header-align="center" />
        <el-table-column prop="mg_state" label="状态" header-align="center">
          <template v-slot:default="state">
            <el-switch v-model="state.row.mg_state" @change="stateChange(state.row)" />
            <!-- {{state.row}} -->
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center">
          <template v-slot:default="">
            <el-button type="primary" icon="el-icon-edit" size="small"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="small"></el-button>
            <el-button type="warning" icon="el-icon-setting" size="small"></el-button>
            <!-- 设置按钮提示信息 -->
            <!-- <el-tooltip
              effect="dark"
              content="角色管理"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="small"></el-button>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        v-model:currentPage="pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="添加新用户"
      width="50%"
      @close="resetAddForm"
    >
    <!-- 对话框内容 -->
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="rules"
        label-width="70px"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAddForm"
            >确认</el-button
          >
          <el-button type="warning" @click="resetAddForm">
            重置
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getUsersList, getStateChange, addUser } from "network/home"

export default {
  name: "Users",
  data() {
    const validateEmail = (rule, value, callback) => {
      let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (value === "") {
        callback(new Error("请输入用户邮箱"));
      } else if (!reg.test(value)) {
        callback(new Error("邮箱格式错误，请重新输入"));
      } else {
        callback();
      }
    }
    const validateMobile = (rule, value, callback) => {
      let reg = /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/
      if (value === "") {
        callback(new Error("请输入用户手机号"));
      } else if (!reg.test(value)) {
        callback(new Error("错误的手机号，请重新输入"));
      } else {
        callback();
      }
    }
    return {
      query: '',
      pagenum: 1,
      pagesize: 5,
      usersList: [],
      total: 0,
      dialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "用户名为3至10个字符",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入用户密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 15,
            message: "用户密码为6至15个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, validator: validateEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, validator: validateMobile, trigger: "blur" }
        ]
      },
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    // 请求用户列表数据
    getUsersList() {
      getUsersList(this.query, this.pagenum, this.pagesize).then(res => {
        console.log(res);
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.usersList = res.data.data.users
        this.total = res.data.data.total
      })
    },
    // 切换每页显示多少条数据时执行的事件
    handleSizeChange(newSize) {
      this.pagesize = newSize
      this.getUsersList()
    },
    // 页码改变时执行的事件
    handleCurrentChange(newPage) {
      this.pagenum = newPage
      this.getUsersList()
    },
    // 监听用户状态改变
    stateChange(userInfo) {
      getStateChange(userInfo.id, userInfo.mg_state).then(res => {
        // console.log(res);
        if(res.data.meta.status !== 200) {
          // userInfo.mg_state = !userInfo.mg_state
          return this.$message.error('更新用户状态失败')
        }
      })
    },
    // 添加用户对话框的重置事件
    resetAddForm() {
      this.$refs.addForm.resetFields();
    },
    // 添加用户对话框的提交事件
    submitAddForm() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          addUser(this.addForm.username, this.addForm.password, this.addForm.email, this.addForm.mobile).then(res => {
            console.log(res);
            if (res.data.meta.status !== 201) {
              return this.$message.error('用户添加失败')
            }
            this.dialogVisible = false
            // 添加成后重新获取用户数据,不需要用户手动刷新
            this.getUsersList()
            return this.$message.success('用户添加成功')
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    }
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 13px;
}
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>