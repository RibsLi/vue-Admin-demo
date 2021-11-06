<template>
  <div class="login">
    <div class="login-wrapper">
      <div class="login-img">
        <img src="~assets/images/logo.png" alt="" />
      </div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        status-icon
        :rules="rules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            autocomplete="off"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            autocomplete="off"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-row :gutter="10">
            <el-col :span="16">
              <el-button type="primary" @click="submitForm('loginForm')" class="btn-form">Login</el-button>
            </el-col>
            <el-col :span="8">
              <el-button @click="resetForm('loginForm')" class="btn-form">Reset</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur',
        },
        {
          min: 3,
          max: 10,
          message: '用户名为3至10个字符',
          trigger: 'blur',
        }],
        password: [{
          required: true,
          message: '请输入用户密码',
          trigger: 'blur',
        },
        {
          min: 6,
          max: 15,
          message: '用户密码为6至15个字符',
          trigger: 'blur',
        }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert("submit!");
          this.$axios.post('login', this.loginForm).then(res => {
            // console.log(res);
            const status = res.data.meta.status
            if (status !== 200) return this.$message.error("登陆失败")
            this.$message.success("登陆成功")
            window.sessionStorage.setItem('token', res.data.data.token)
            this.$router.push('/home')
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #344a5f;
  user-select: none;
  .login-wrapper {
    width: 350px;
    height: 280px;
    background-color: #fff;
    position: relative;
    .login-img {
      width: 100px;
      height: 100px;
      padding: 10px;
      border-radius: 50%;
      border: 1px solid #ccc;
      background-color: #fff;
      box-shadow: 0 0 5px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .login-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0 10px;
    }
    .btn-form {
      width: 100%;
    }
  }
}
</style>