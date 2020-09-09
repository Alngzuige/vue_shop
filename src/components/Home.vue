<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" />
        <h1>电商管理后台系统</h1>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 内容区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="iscoll ? '64px' : '200px'">
        <el-row class="tac">
          <el-col>
            <el-menu
              background-color="#333744"
              text-color="#fff"
              :unique-opened="true"
              router
              :default-active="setctive"
              :collapse="iscoll"
              :collapse-transition="false"
            >
              <div class="btn" @click="iscoll = !iscoll">|||</div>
              <!-- 一级目录 -->
              <el-submenu
                :index="item.id + ''"
                v-for="(item, index) in memulist"
                :key="item.id"
              >
                <template slot="title">
                  <i :class="iconlist[index]"></i>
                  <span>{{ item.authName }}</span>
                </template>

                <!-- 二级目录 -->
                <el-menu-item
                  :index="'/' + subitem.path"
                  v-for="subitem in item.children"
                  :key="subitem.id"
                  @click="saveactive('/' + subitem.path)"
                >
                  <i class="el-icon-menu"></i>
                  <span>{{ subitem.authName }}</span>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <!-- 中间内容部分 -->
      <el-main>
        <!-- 主体路由部分 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMemuList();
    this.setctive = window.sessionStorage.getItem("setctive");
  },
  data() {
    return {
      //定义菜单内容
      memulist: [],
      iscoll: false,
      iconlist: [
        "el-icon-user-solid",
        "el-icon-warning",
        "el-icon-s-goods",
        "el-icon-tickets",
        "el-icon-s-platform"
      ],
      //设置当前索引页面
      setctive: ""
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMemuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status === !200) {
        return this.$message.error(res.meta.msg);
      } else {
        this.memulist = res.data;
      }
    },
    saveactive(active) {
      window.sessionStorage.setItem("setctive", active);
      this.setctive = active;
    }
  }
};
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
  min-width: 1600px;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
    color: #fff;
    align-items: center;
    height: 100%;
    img {
      height: 100%;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf2;
}
.el-menu {
  border: none;
  .btn {
    color: #fff;
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: #999999;
    cursor: pointer;
  }
}
</style>
