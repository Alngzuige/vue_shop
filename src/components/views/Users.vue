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
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
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
          <template>
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
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="40%">
      <!-- 弹窗的主题内容 -->
      <el-form
        :model="adduser"
        :rules="adduserrules"
        ref="adduserref"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="adduser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="adduser.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="adduser.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="adduser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹窗的底部内容 -->
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
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
      // 更新用户列表的对象
      getuser: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userpage: [],
      // 添加用户的对象
      adduser: {
        username: null,
        password: null,
        email: null,
        mobile: null,
      },
      // 用户表单的验证规则
      adduserrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            require: true,
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            require: true,
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入电话", trigger: "blur" }],
      },
      // 控制添加用户对话框的显示隐藏
      dialogVisible: false,
    };
  },
  methods: {
    //请求数据
    async getUserlist() {
      const { data: res } = await this.$http.get("users", {
        params: this.getuser,
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取用户列表失败！");
      } else {
        this.$message.success("获取用户列表成功！");
      }
      this.userlist = res.data.users;
      this.userpage = res.data;
    },
    //更新页面
    handleSizeChange(newsize) {
      this.getuser.pagesize = newsize;
      this.getUserlist();
    },
    //更新跳转页面
    handleCurrentChange(newcurrent) {
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
    },
    async addUsers() {
      this.dialogVisible = false;
      const { data: res } = await this.$http.post("users", this.adduser);
      console.log(res);
      if (res.meta.status !== 201) {
        return this.$message.error("添加用户失败");
      } else {
        this.$message.success("添加用户成功");
      }
    },
  },
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
