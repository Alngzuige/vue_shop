<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addPranesCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 树形结构图 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :show-row-hover="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        style="margin-top:20px"
      >
        <!-- 自定义模块是否有效 -->
        <template slot="valid" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted == false"
            style="color: lightgreen;"
          ></i>
          <i class="el-icon-error" style="color: lightgreen;" v-else></i>
        </template>
        <!-- 自定义模块排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag type="" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 自定义模块按钮 -->
        <template slot="btn" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="cateQuery(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cateObj.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="cateObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 弹出编辑对话框 -->
    <el-dialog title="编辑分类" :visible.sync="CateVisible" width="40%">
      <el-form :model="cateQueryData" label-width="100px">
        <el-form-item label="分类名称：">
          <el-input v-model="cateQueryData.cateValue"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="CateVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateVisible"
      width="50%"
      @close="addCateDiolg"
    >
      <el-form
        :model="addCateFrom"
        label-width="100px"
        :rules="addCateFromRules"
        ref="addCateFromRef"
      >
        <el-form-item label="父级分类：" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="请选择：">
          <!-- options代表请求的数据 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            v-model="selectKes"
            :options="parentCatelist"
            :props="cateProps"
            @change="cateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表内容
      cateList: [],
      // 请求商品列表内容
      cateObj: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品总数
      total: 0,
      // 保存查询到的内容
      cateQueryData: {
        cateValue: ""
      },
      // id
      cat_id: null,
      // 编辑对话框时是否显示
      CateVisible: false,
      // 添加分类对话框
      addCateVisible: false,
      // 添加分类的表单数据对象
      addCateFrom: {
        // 分类父 ID
        cat_pid: 0,
        // 分类名称
        cat_name: "",
        // 分类层级
        cat_level: 0
      },
      // 添加分类的验证规则
      addCateFromRules: {
        cat_name: [
          { required: true, message: "请输入分类的名称", trigger: "blur" }
        ]
      },
      // 存放获取父级分类的id
      selectKes: [],
      // 存放父级列表的数据源
      parentCatelist: [],
      // 指定父级列表的配置对象
      cateProps: {
        checkStrictly: true,
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 表格的配置文件
      columns: [
        {
          label: "产品分类",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "valid"
        },
        {
          label: "排序",
          type: "template",
          template: "sort"
        },
        {
          label: "操作",
          type: "template",
          template: "btn"
        }
      ]
    };
  },
  methods: {
    // 获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.cateObj
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类失败");
      }
      this.$message.success("获取分类成功");
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    // 定义查询按钮
    cateQuery(roles) {
      this.CateVisible = true;
      // this.cateQueryData = roles;
      this.cateQueryData.cateValue = roles.cat_name;
      this.cat_id = roles.cat_id;
    },
    // 修改商品分类名称
    async changeCate() {
      const { data: res } = await this.$http.put(`categories/${this.cat_id}`, {
        cat_name: this.cateQueryData.cateValue
      });
      if (res.meta.status !== 200) {
        return this.$message.error("更改名称失败");
      }
      this.$message.success("更改名称成功");
      this.getCateList();
      this.CateVisible = false;
    },
    // 更改页码刷新
    handleSizeChange(newsizi) {
      this.cateObj.pagesize = newsizi;
      this.getCateList();
    },
    handleCurrentChange(newnum) {
      this.cateObj.pagenum = newnum;
      this.getCateList();
    },
    // 添加分类的按钮
    async addPranesCate() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.parentCatelist = res.data;
      this.addCateVisible = true;
    },
    // 选择项发生改变触发的函数
    cateChange() {
      if (this.selectKes.length > 0) {
        this.addCateFrom.cat_pid = this.selectKes[this.selectKes.length - 1];
        this.addCateFrom.cat_level = this.selectKes.length;
        console.log(this.selectKes.length);
        return;
      } else {
        this.addCateFrom.cat_pid = 0;
        this.addCateFrom.cat_level = 0;
      }
    },
    // 添加分类
    addCate() {
      this.$refs.addCateFromRef.validate(async vaild => {
        if (!vaild) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateFrom
        );
        if (res.meta.status !== 201) {
          this.$message.error("添加分类失败");
        }
        this.$message.success("添加分类成功");
        this.getCateList();
        this.addCateVisible = false;
      });
    },
    // 监听对话窗关闭，并清空内容
    addCateDiolg() {
      this.$refs.addCateFromRef.resetFields();
      this.selectKes = [];
      this.addCateFrom.cat_pid = 0;
      this.addCateFrom.cat_level = 0;
    },
    // 删除商品分类
    async deleteCate(roles) {
      const del = await this.$confirm(
        "此操作将永久删除该产品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (del != "confirm") {
        return this.$message.info("已取消删除");
      }
      // console.log();
      const { data: res } = await this.$http.delete(
        `categories/${roles.cat_id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getCateList();
    }
  },
  created() {
    this.getCateList();
  }
};
</script>

<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>
