<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>
      <!-- 加载条 -->
      <el-steps
        :space="300"
        :active="addActive - 0"
        align-center
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- Tbs标签页 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRuleForm"
        label-positaion="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="addActive"
          :before-leave="beforeTabLeave"
          @tab-click="tabChecked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children'
                }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="(item, index) in manyTabs"
              :key="index"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(item2, index2) in item.attr_vals"
                  :key="index2"
                  :label="item2"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="(item, index) in onlyTabs"
              :key="index"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="headerSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <el-button type="primary" @click="addCommodity" class="margin">
              添加商品
            </el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片缩略图对话框 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
      <img width="100%" :src="previewPath" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      // 默认显示
      addActive: "0",
      // 表单内容
      addForm: {
        // 商品名称
        goods_name: "",
        // 以为','分割的分类列表
        goods_cat: [],
        // 价格
        goods_price: "",
        // 数量
        goods_number: "",
        // 重量
        goods_weight: "",
        // 介绍
        goods_introduce: "",
        // 图片缓存路径
        pics: [],
        // 商品介绍
        goods_introduce: "",
        // 商品的参数，包含动态参数静态属性
        attrs: []
      },
      // 表单验证
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      // 商品分类
      cateList: [],
      // 产品参数列表
      manyTabs: [],
      // 产品属性列表
      onlyTabs: [],
      // 商品图片上传路径
      uploadUrl: "http://timemeetyou.com:8889/api/private/v1/upload",
      // 图片上传请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      // 显示图片预览弹窗
      dialogVisible: false,
      // 图片缩略图路径
      previewPath: ""
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.cateList = res.data;
    },
    // 选择的商品分类
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // 标签页的钩子函数
    beforeTabLeave(newActive, oldActice) {
      if (oldActice === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    // 进入下一个标签
    async tabChecked() {
      if (this.addActive === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cataId}/attributes`,
          {
            params: {
              sel: "many"
            }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品参数失败");
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTabs = res.data;
        console.log(this.manyTabs);
      } else if (this.addActive === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cataId}/attributes`,
          {
            params: {
              sel: "only"
            }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品属性失败");
        }
        this.onlyTabs = res.data;
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      console.log(file);
      this.dialogVisible = true;
    },
    // 移出图片的操作
    handleRemove(file) {
      // 1、获取即将要被删除图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 2、从pics数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic == filePath);
      // 3、调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.addForm.pics.splice(i, 1);
    },
    // 上传图片成功的操作
    headerSuccess(res) {
      const picInfo = { pic: res.data.tmp_path };
      this.addForm.pics.push(picInfo);
    },
    // 添加商品按钮
    addCommodity() {
      this.$refs.addFormRuleForm.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项");
        } else {
          const form = _.cloneDeep(this.addForm);
          form.goods_cat = form.goods_cat.join(",");
          // 处理动态参数
          this.manyTabs.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(" ")
            };
            this.addForm.attrs.push(newInfo);
          });
          // 处理静态属性
          this.onlyTabs.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            };
            this.addForm.attrs.push(newInfo);
          });
          form.attrs = this.addForm.attrs;
          const { data: res } = await this.$http.post("goods", form);
          if (res.meta.status !== 201) {
            return this.$message.error("添加商品失败");
          }
          this.$message.success("添加商品成功");
          this.$router.push("/goods");
        }
      });
    }
  },
  computed: {
    cataId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  }
};
</script>

<style scoped>
.el-form >>> .el-form-item__label {
  float: none;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.margin {
  margin-top: 15px;
}
</style>
