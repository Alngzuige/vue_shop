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
          <template slot-scope="scope">
            <!-- 修改用户按钮 -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="modificationUser(scope.row.id)"
            ></el-button>
            <!-- 删除用户按钮 -->
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-delete"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <!-- 分配用户权限按钮 -->
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
    <!-- 添加用户主体弹窗 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="40%"
      @close="adduserref"
    >
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
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="adduser.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="adduser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹窗的底部内容 -->
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户主体弹窗 -->
    <el-dialog
      title="修改用户"
      :visible.sync="modificatVisible"
      width="40%"
      @close="modificatRef"
    >
      <!-- 弹窗的主题内容 -->
      <el-form
        ref="modificatRef"
        :model="modificatUser"
        :rules="adduserrules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="modificatUser.username"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="modificatUser.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="modificatUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹窗的底部内容 -->
      <span slot="footer">
        <el-button @click="modificatVisible = false">取 消</el-button>
        <el-button type="primary" @click="amendVisible">确 定</el-button>
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
    //验证邮箱的规则
    var chekEmail = (rule, value, cb) => {
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (regEmail.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法的邮箱"));
      }
    };
    //验证手机号的规则
    var chekMobile = (rule, value, cb) => {
      const regPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (regPhone.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法的电话"));
      }
    };
    return {
      userlist: [],
      // 更新用户列表的对象
      getuser: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userpage: [],
      // 添加用户的对象
      adduser: {
        username: null,
        password: null,
        email: null,
        mobile: null
      },
      //查询修改用户对象
      modificatUser: {},
      // 用户表单的验证规则
      adduserrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            require: true,
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            require: true,
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: chekEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: chekMobile, trigger: "blur" }
        ]
      },
      // 控制添加用户对话框的显示隐藏
      dialogVisible: false,
      //控制修改用户对话框的显示隐藏
      modificatVisible: false
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
    // 添加用户表单
    async addUsers() {
      const { data: res } = await this.$http.post("users", this.adduser);
      //验证表单内容是否正确
      this.$refs.adduserref.validate(valid => {
        if (!valid) {
          return;
        } else {
          console.log(res);
          if (res.meta.status !== 201) {
            return this.$message.error("添加用户失败");
          } else {
            this.$message.success("添加用户成功");
            this.dialogVisible = false;
            this.getUserlist();
          }
        }
      });
    },
    //监听表单取消并清空数据事件
    adduserref() {
      this.$refs.adduserref.resetFields();
    },
    modificatRef() {
      this.$refs.modificatRef.resetFields();
    },
    //查询用户信息
    async modificationUser(id) {
      this.modificatVisible = true;
      const { data: res } = await this.$http.get(`users/${id}`);
      this.modificatUser = res.data;
      console.log(res);
    },
    // 修改用户信息
    amendVisible() {
      this.$refs.modificatRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          const { data: res } = await this.$http.put(
            `users/${this.modificatUser.id}`,
            {
              email: this.modificatUser.email,
              mobile: this.modificatUser.mobile
            }
          );
          if (res.meta.status !== 200) {
            return this.$message.error("更新信息失败");
          } else {
            this.modificatVisible = false;
            this.getUserlist();
            return this.$message.success("更新信息成功");
          }
        }
      });
    },
    // 删除用户
    async deleteUser(id) {
      const del = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
      console.log(del);
      if (del == "confirm") {
        const { data: res } = await this.$http.delete(`users/${id}`);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        } else {
          this.$message.success("删除成功");
          this.getUserlist();
        }
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
