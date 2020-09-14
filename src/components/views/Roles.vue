<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="rolesVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色权限内容 -->
      <el-table
        :data="rolesList"
        style="width: 100%; margin-top:20px"
        border
        stripe
      >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="[
                'borderBottom',
                i1 === 0 ? 'borderTop' : '',
                'vuecenter'
              ]"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染商品权限第一列 -->
              <el-col :span="5">
                <el-tag @close="removeTag(scope.row, item1.id)" closable>{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染商品权限第二列和第三列 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'borderTop', 'vuecenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 第二列的内容 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      @close="removeTag(scope.row, item2.id)"
                      closable
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeTag(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop="level" width="300px">
          <template slot-scope="scope">
            <!-- 编辑角色权限 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="queryRoles(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除角色权限 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRoles(scope.row.id)"
              >删除</el-button
            >
            <!-- 分配角色权限 -->
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-star-off"
              @click="getRolesData(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色弹窗内容 -->
    <el-dialog
      title="添加角色"
      :visible.sync="rolesVisible"
      width="40%"
      @close="RolesFields"
    >
      <!-- 弹窗主体内容 -->
      <el-form
        ref="rolesForm"
        :rules="rolesRules"
        :model="rolesObj"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesObj.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="rolesObj.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹窗底部消息 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色弹窗内容 -->
    <el-dialog title="修改角色" :visible.sync="reviseVisible" width="40%">
      <!-- 弹窗主体内容 -->
      <el-form
        ref="qureyForm"
        :rules="rolesRules"
        :model="rolesQuery"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesQuery.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="rolesQuery.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹窗底部消息 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="reviseVisible = false">取 消</el-button>
        <el-button type="primary" @click="reviseRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色弹窗内容 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignRolesVisible"
      width="30%"
      @close="setRolesDialong"
    >
      <el-tree
        :data="rolesData"
        :props="rolesProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKes"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 是否弹窗属性
      rolesVisible: false,
      reviseVisible: false,
      assignRolesVisible: false,
      // 传角色列表对象
      rolesObj: {
        roleName: null,
        roleDesc: null
      },
      // 定义查询的角色列表参数
      rolesQuery: {},
      // 分配角色权限列表
      rolesData: [],
      // 默认显示的子元素
      defKes: [],
      // 树形图显示的子元素
      rolesProps: {
        children: "children",
        label: "authName"
      },
      // 默认勾选的树形图
      defList: [],
      // 当前即将被勾选的id
      roteleID: "",
      // 定义角色校验
      rolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    // 获取用户列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色权限列表失败");
      }
      this.rolesList = res.data;
    },
    // 添加用户弹窗按钮
    async addRoles() {
      // 添加用户
      const { data: res } = await this.$http.post("roles", this.rolesObj);
      // 验证表单内容是否正确
      this.$refs.rolesForm.validate(valid => {
        if (!valid) {
          return;
        }
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败");
        } else {
          this.$message.success("添加用户成功");
          this.rolesVisible = false;
          this.getRolesList();
        }
      });
    },
    // 监听表单取消清空数据
    RolesFields() {
      this.$refs.rolesForm.resetFields();
    },
    // 查询用户列表信息
    async queryRoles(id) {
      this.reviseVisible = true;
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户信息失败");
      }
      this.rolesQuery = res.data;
    },
    // 修改用户信息
    reviseRoles() {
      // 验证表单信息
      this.$refs.qureyForm.validate(async valid => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.put(
          `roles/${this.rolesQuery.roleId}`,
          {
            roleName: this.rolesQuery.roleName,
            roleDesc: this.rolesQuery.roleDesc
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("修改用户信息失败");
        } else {
          this.$message.success("修改用户信息成功");
          this.getRolesList();
          this.reviseVisible = false;
        }
      });
    },
    // 删除角色
    async deleteRoles(id) {
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
      if (del == "confirm") {
        const { data: res } = await this.$http.delete(`roles/${id}`);
        if (res.meta.status !== 200) {
          return this.message.error("删除失败");
        } else {
          this.$message.success("删除成功");
          this.getRolesList();
        }
      }
    },
    // 删除权限
    async removeTag(roles, id2) {
      const del = await this.$confirm(
        "此操作将永久取消该角色权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (del !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${roles.id}/rights/${id2}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("已成功取消该角色权限");
      roles.children = res.data;
    },
    //获取权限列表
    async getRolesData(roles) {
      this.roteleID = roles.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      }
      this.rolesData = res.data;
      this.assignRolesVisible = true;
      // 调用递归方法
      this.getLeafKeys(roles, this.defKes);
    },
    // 通过递归的形式，获取角色下面所有的三级权限的id，并保存到defKes数组上
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(element => {
        this.getLeafKeys(element, arr);
      });
    },
    // 监听分配权限对话框的关闭事件
    setRolesDialong() {
      this.defKes = [];
    },
    // 分配权限
    async allotRoles() {
      const itkes = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const strkey = itkes.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roteleID}/rights`,
        {
          rids: itkes
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("更新权限失败");
      }
      this.$message.success("更新权限成功");
      this.getRolesList();
      this.assignRolesVisible = false;
    }
  },
  created() {
    // 获取用户列表数据
    this.getRolesList();
  }
};
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 10px;
}
.borderTop {
  border-top: 1px solid #eee;
}
.borderBottom {
  border-bottom: 1px solid #eee;
}
.vuecenter {
  display: flex;
  align-items: center;
}
</style>
