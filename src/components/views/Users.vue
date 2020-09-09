<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" width="200px">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table style="width: 100%" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="date" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="name" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="address" label="电话"> </el-table-column>
        <el-table-column label="角色"></el-table-column>
        <el-table-column label="状态"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getUserlist();
  },
  data() {
    return {
      userlist: [],
      getuser: {
        query: "",
        pagenum: 1,
        pagesize: 2
      }
    };
  },
  methods: {
    async getUserlist() {
      const { data: res } = await this.$http.get("users", {
        params: this.getuser
      });
      this.userlist = res.data.users;
      console.log(this.userlist);
    }
  }
};
</script>
