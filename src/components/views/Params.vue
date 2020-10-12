<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告窗口 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 级联选择器 -->
      <el-row class="margin-top">
        <el-col>
          <span>请选择商品分类：</span>
          <el-cascader
            v-model="seledCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 静态动态选项卡 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isButtonbled"
            class="margin-top"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyData" border style="width: 100%" stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  closable
                  :key="i"
                  @close="removeTag(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else size="small" @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteParms(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isButtonbled"
            @click="addDialogVisible = true"
            class="margin-top"
            >添加属性</el-button
          >
          <el-table :data="onlyData" border style="width: 100%" stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  closable
                  :key="i"
                  @close="removeTag(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else size="small" @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteParms(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加静态属性/动态参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addParmasValue"
        :rules="addParmasRules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item :label="titleText + ':'" prop="attr_name">
          <el-input v-model="addParmasValue.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParmas">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改静态属性/动态参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="editParmasValue"
        :rules="addParmasRules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item :label="titleText + ':'" prop="attr_name">
          <el-input v-model="editParmasValue.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParmas">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类参数
      catelist: [],
      // 级联选择器选中的值
      seledCateKeys: [],
      // 级联选择器的配置
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 默认选中的的选项卡
      activeName: "many",
      // 动态表格参数
      manyData: [],
      // 静态表格属性
      onlyData: [],
      // 对话框的显示隐藏
      addDialogVisible: false,
      editDialogVisible: false,
      // 添加属性的名称
      addParmasValue: {
        attr_name: ""
      },
      // 添加表单的表单验证
      addParmasRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      // 查询到的内容
      editParmasValue: {},
      // 当前需要修改的内容id
      attrId: ""
    };
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.catelist = res.data;
    },
    // 级联选择器选中后的变化
    handleChange() {
      this.getParamsData();
    },
    // 选择选项卡发生的事件
    handleClick() {
      this.getParamsData();
    },
    // 获取参数的数据列表
    async getParamsData() {
      if (this.seledCateKeys.length !== 3) {
        this.seledCateKeys = [];
        this.manyData = [];
        this.onlyData = [];
        return;
      }
      // 当选中三级分类的时候，请求接口获取内容
      const { data: res } = await this.$http.get(
        `categories/${this.getId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      console.log(res.data);
      //添加三级标签
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 添加自定义属性
        item.inputVisible = false;
        item.inputValue = "";
        // console.log(item.attr_vals);
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数信息失败");
      }
      if (this.activeName === "many") {
        this.manyData = res.data;
      } else {
        this.onlyData = res.data;
      }
    },
    // 监听弹窗消失后清除内容
    addDialogClosed() {
      this.$refs.ruleForm.resetFields();
    },
    // 点击按钮，添加参数
    addParmas() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.getId}/attributes`,
          {
            attr_name: this.addParmasValue.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加属性失败");
        }
        this.$message.success("添加属性成功");
        this.getParamsData();
        this.addDialogVisible = false;
      });
    },
    // 显示修改对话框
    async showEditDialog(id) {
      this.attrId = id;
      const { data: res } = await this.$http.get(
        `categories/${this.getId}/attributes/${id}`
      );
      if (res.meta.status !== 200) {
        this.$message.error("获取信息失败");
      }
      this.editParmasValue = res.data;
      this.editDialogVisible = true;
    },
    // 修改分类内容
    async editParmas() {
      const { data: res } = await this.$http.put(
        `categories/${this.getId}/attributes/${this.attrId}`,
        {
          attr_name: this.editParmasValue.attr_name,
          attr_sel: this.activeName
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改属性失败");
      }
      this.$message.success("修改属性成功");
      this.getParamsData();
      this.editDialogVisible = false;
    },
    // 删除属性内容
    async deleteParms(id) {
      const del = await this.$confirm(
        "此操作将永久删除该属性, 是否继续?",
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
        `categories/${this.getId}/attributes/${id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getParamsData();
    },
    // 回车或者失去表单焦点触发事件
    async handleInputConfirm(row) {
      // 判断用户是否输入了内容，如果没输入内容，则清空里面的空格，并隐藏表单，return回去
      if (row.inputValue.trim().length === 0) {
        (row.inputValue = ""), (row.inputVisible = false);
        return;
      }
      // 如果没有return，再进行后续处理
      row.attr_vals.push(row.inputValue);
      (row.inputValue = ""), (row.inputVisible = false);
      this.changeTag(row);
    },
    // 改变标签操作
    async changeTag(row) {
      // 发起请求到接口
      const { data: res } = await this.$http.put(
        `categories/${this.getId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改属性失败");
      }
      this.$message.success("修改参数成功");
    },
    // 显示表单
    showInput(row) {
      row.inputVisible = true;
      // $nextTick 方法的作用，就是当页面上的元素开始被重新渲染的之后，执行里面的回调函数
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除标签
    removeTag(i, row) {
      row.attr_vals.splice(i, 1);
      this.changeTag(row);
    }
  },
  created() {
    this.getCateList();
  },
  // 计算属性方法区
  computed: {
    // 如果未选中三级分类返回的是一个true，选中则返回false
    isButtonbled() {
      if (this.seledCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 获取选中的三级分类id
    getId() {
      if (this.seledCateKeys.length === 3) {
        return this.seledCateKeys[2];
      }
      return null;
    },
    // 判断添加动态参数还是静态属性
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    }
  }
};
</script>

<style lang="scss" scoped>
.el-cascader-menu {
  height: 150px;
}
.margin-top {
  margin: 20px 0;
}
.el-tag {
  margin: 0 10px;
}
.input-new-tag {
  width: 125px;
}
</style>
