<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border stripe></el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 定义权限列表的数组
      rightsList: [],
    };
  },
  created() {
    // 获取权限管理
    this.getRigthsList();
  },
  methods: {
    // 获取权限管理列表
    async getRigthsList() {
      const { data: res } = await this.$http.get("rights/list");
      console.log(res.data);
    },
  },
};
</script>

<style>
</style>
