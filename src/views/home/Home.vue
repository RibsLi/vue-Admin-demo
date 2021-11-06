<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div class="header-img">
        <img src="~assets/images/logo.png" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" size="medium" @click="logoutClick">退出</el-button>
    </el-header>

    <el-container>
      <!-- 侧栏 -->
      <el-aside :width="isToggle? '64px' : '200px'">
        <div class="toggle" @click="toggleClick">| | |</div>
        <el-menu
          active-text-color="#409eff"
          background-color="#3a3d44"
          text-color="#fff"
          unique-opened
          :collapse="isToggle"
          :collapse-transition="false"
          router
        >
          <!-- 一级菜单 -->
          <el-sub-menu
            :index="String(item.id)"
            v-for="(item, index) in menuList"
            :key="index"
          >
            <template #title>
              <i :class="icon[index]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + item.path"
              v-for="(item, index) in item.children"
              :key="index"
            >
              <i class="el-icon-menu"></i>
              <span>{{ item.authName }}</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- main -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from "network/home";

export default {
  name: "Home",
  data() {
    return {
      menuList: [],
      icon: ['el-icon-user-solid', 'el-icon-connection', 'el-icon-goods', 'el-icon-s-order', 'el-icon-data-line'],
      isToggle: false
    };
  },
  methods: {
    // 退出事件
    logoutClick() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 折叠菜单栏
    toggleClick() {
      this.isToggle = !this.isToggle
    }
  },
  created() {
    // 请求菜单列表数据
    getMenuList().then((res) => {
      console.log(res);
      if (res.data.meta.status !== 200)
        return this.$message.error(res.data.meta.msg);
      this.menuList = res.data.data;
    });
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100vh;
  user-select: none;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #242424;
    color: #fff;
    font-weight: 700;
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
    .toggle {
      background-color: #67676b;
      font-size: 12px;
      line-height: 30px;
      color: #fff;
      text-align: center;
    }
    .el-menu {
      border-right: 0;
    }
    .el-menu-item {
      font-size: 13px;
    }
    .el-menu-item:focus {
      background-color: rgb(46, 49, 54);
    }
  }
  .el-main {
    background-color: #eee;
  }
}
</style>