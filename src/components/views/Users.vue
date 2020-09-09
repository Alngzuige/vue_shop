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
          <el-input
            placeholder="请输入内容"
            width="200px"
            v-model="getuser.query"
            clearable
            @clear="getUserlist"
          >
            <el-button
              @click="getUserlist"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="220">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userchange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-delete"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getuser.pagenum"
        :page-sizes="[2, 5, 8, 10]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userpage.total"
      >
      </el-pagination>
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
      },
      userpage: []
    };
  },
  methods: {
    //请求数据
    async getUserlist() {
      const { data: res } = await this.$http.get("users", {
        params: this.getuser
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取用户列表失败！");
      } else {
        this.$message.success("获取用户列表成功！");
      }
      this.userlist = res.data.users;
      console.log(res.data);
      this.userpage = res.data;
    },
    //更新页面
    handleSizeChange(newsize) {
      console.log(newsize);
      this.getuser.pagesize = newsize;
      this.getUserlist();
    },
    //更新跳转页面
    handleCurrentChange(newcurrent) {
      console.log(newcurrent);
      this.getuser.pagenum = newcurrent;
      this.getUserlist();
    },
    async userchange(newswitch) {
      const { data: res } = await this.$http.put(
        `users/${newswitch.id}/state/${newswitch.mg_state}`
      );
      if (res.meta.status !== 200) {
        newswitch.mg_state = !newswitch.mg_state;
        return this.$message.error("更新用户失败");
      } else {
        this.$message.success("更新用户成功");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
