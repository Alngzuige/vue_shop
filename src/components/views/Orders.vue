<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            width="200px"
            clearable
            v-model="ordersObj.query"
            @clear="getOrdersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="ordersList" style="width: 100%" border>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status !== '0'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <!-- 编辑按钮 -->
          <el-button
            type="primary"
            @click="compileSite"
            size="mini"
            icon="el-icon-edit"
          ></el-button>
          <el-button
            type="success"
            size="mini"
            icon="el-icon-location"
            @click="showExpressage"
          ></el-button>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="ordersObj.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 弹出修改地址的对话窗 -->
    <el-dialog
      title="修改地址"
      :visible.sync="alterVisible"
      width="40%"
      @close="dialogColose"
    >
      <el-form
        ref="rdersFormRef"
        :rules="rdersFormRules"
        :model="rdersForm"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="addrders1">
          <el-cascader
            v-model="rdersForm.addrders1"
            :options="cityData"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="addrders2">
          <el-input v-model="rdersForm.addrders2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alterVisible = false">取 消</el-button>
        <el-button type="primary" @click="alterVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 弹出快递信息对话窗 -->
    <el-dialog title="物流进度" :visible.sync="expressageVisible" width="40%">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in ExpressageList"
          :key="index"
          :timestamp="item.time"
        >
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./city_data2017_element";
export default {
  data() {
    return {
      // 获取订单列表
      ordersList: [],
      ordersObj: {
        // 查询参数
        query: "",
        // 当前页面
        pagenum: 1,
        // 每页显示几条内容
        pagesize: 5
      },
      // 总数
      total: 0,
      // 编辑地址对话框
      alterVisible: false,
      expressageVisible: false,
      rdersForm: {
        addrders1: [],
        addrders2: ""
      },
      rdersFormRules: {
        addrders1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" }
        ],
        addrders2: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      cityData,
      // 快递信息
      ExpressageList: []
    };
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    // 获取订单列表
    async getOrdersList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.ordersObj
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单失败");
      }
      this.ordersList = res.data.goods;
      this.total = res.data.total;
    },
    // 更改页码
    handleSizeChange(newsize) {
      this.ordersObj.pagesize = newsize;
      this.getOrdersList();
    },
    // 上一页下一页
    handleCurrentChange(newsize) {
      this.ordersObj.pagenum = newsize;
      this.getOrdersList();
    },
    // 弹出编辑地址对话窗
    compileSite() {
      this.alterVisible = true;
    },
    // 监听对话窗口后清空表单内容
    dialogColose() {
      this.$refs.rdersFormRef.resetFields();
    },
    // 弹出物流信息
    async showExpressage() {
      const { data: res } = await this.$http.get("/kuaidi/804909574412544580");
      if (res.meta.status !== 200) {
        return this.$message.error("获取物流信息失败");
      }
      this.ExpressageList = res.data;
      this.expressageVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-table {
  margin: 20px 0;
}
.el-cascader {
  width: 100%;
}
</style>
