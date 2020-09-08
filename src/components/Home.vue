<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png">
        <h1>电商管理后台系统</h1>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 内容区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside>Aside</el-aside>
      <!-- 中间内容部分 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div{
    display: flex;
    color: #fff;
    align-items: center;
    height: 100%;
    img{
      height: 100%;
    }
  }
}
.el-aside {
  width: 200px;
  background-color: #333744;
}
.el-main {
  background-color: #ccc;
}
</style>