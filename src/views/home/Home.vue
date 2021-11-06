<template>
  <el-container>
    <el-header>
      <div class="header-img">
        <img src="~assets/images/logo.png" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logoutClick">退出</el-button>
    </el-header>
    <el-container>
      <el-aside>
        <el-menu
          active-text-color="#ffd04b"
          background-color="#3a3d44"
          text-color="#fff"
        >
          <el-sub-menu index="1">
            <template #title>
              <i class="el-icon-user-solid"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-user-solid"></i>
              <span>用户管理</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <i class="el-icon-connection"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-user-solid"></i>
              <span>用户管理</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <i class="el-icon-goods"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-user-solid"></i>
              <span>用户管理</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              <i class="el-icon-s-order"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-user-solid"></i>
              <span>用户管理</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="5">
            <template #title>
              <i class="el-icon-data-line"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="5-1">
              <i class="el-icon-user-solid"></i>
              <span>用户管理</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  methods: {
    logoutClick() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100vh;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #242424;
    color: #fff;
    .header-img {
      display: flex;
      align-items: center;
      justify-content: space-between;
      img {
        width: 45px;
        height: 45px;
        border-radius: 100%;
        background-color: #fff;
        padding: 5px;
        margin-right: 10px;
        box-shadow: 0 0 5px #ddd;
      }
    }
  }
  .el-aside {
    background-color: #3a3d44;
    width: 200px;
  }
  .el-main {
    background-color: #eee;
  }
}
</style>