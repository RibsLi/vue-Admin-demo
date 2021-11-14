<template>
  <div class="goods">
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索框和添加商品 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入搜索内容" v-model="query" clearable @clear="getGoodsList" @keyup.enter="searchClick">
            <template #append>
              <el-button icon="el-icon-search" @click="searchClick"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 列表信息 -->
      <el-table :data="goodsList" border stripe height="69.7vh" highlight-current-row style="width: 100%">
        <el-table-column type="index" label="序号" header-align="center" align="center" />
        <el-table-column prop="goods_name" label="商品名称" header-align="center" sortable />
        <el-table-column prop="goods_price" label="价格（元）" header-align="center" sortable />
        <el-table-column prop="goods_weight" label="商品重量" header-align="center" sortable />
        <el-table-column prop="add_time" label="创建时间" header-align="center" sortable>
          <template v-slot:default="scope">
            {{commentData(scope.row.add_time)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" width="173px">
          <template v-slot:default="handle">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="small" @click="editClick(handle.row.goods_id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="small" @click="removeClick(handle.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        v-model:currentPage="pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-card>
    <!-- 商品列表编辑对话框 -->
    <el-dialog
      v-model="editDialog"
      title="修改商品信息"
      width="50%"
      :close-on-click-modal="false"
      @close="resetEditForm"
    >
    <!-- 对话框内容 -->
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="rules"
        label-width="80px"
        status-icon
        label-position="top"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品参数">
          <el-form-item :label="item.attr_name" v-for="item in editForm.attrs" :key="item.attr_id">
            <el-input v-model="item.attr_value"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="商品图片">
          <img :src="item.pics_sma_url" alt="" v-for="item in editForm.pics" :key="item.pics_id" class="uploadImg">
          <el-upload
            :action="uploadURL"
            list-type="picture-card"
            multiple
            :headers="headersObj"
            :on-success="uploadSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <!-- <i class="el-icon-plus"></i> -->
          </el-upload>
        </el-form-item>
        <el-form-item label="商品介绍">
          <vue3-tinymce v-model="editForm.goods_introduce" :setting="setting" />
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialog = false">取消</el-button>
          <el-button type="primary" @click="submitEditForm"
            >确认</el-button
          >
          <el-button type="warning" @click="resetEditForm">
            重置
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 图片预览对话框 -->
    <el-dialog
      v-model="preVisible"
      title="预览图片"
      width="50%"
    >
    <img :src="previewPath" alt="" class="preImg">
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsList, deleteGoods, getGoodsInfo, setGoods } from "network/goods"
import { formatDate } from "common/utils";
// 富文本编辑器插件
import Vue3Tinymce from '@jsdawn/vue3-tinymce'

export default {
  name: "Goods",
  data() {
    return {
      query: '',
      pagenum: 1, 
      pagesize: 10,
      goodsList: [],
      total: 0,
      editForm: {},
      editDialog: false,
      uploadURL: "https://lianghj.top:8888/api/private/v1/upload",
      preVisible: false,
      headersObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      rules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 50,
            message: "商品名称为2至50个字符",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
          { 
            pattern: /^[1-9]*[1-9][0-9]*$/,
            message: '请输入大于0的数',
            trigger: "blur",
          } 
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
          { 
            pattern: /^[1-9]*[1-9][0-9]*$/,
            message: '请输入大于0的正整数',
            trigger: "blur",
          } 
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
          { 
            pattern: /^\+?[1-9]\d*$/,
            message: '请输入大于0的正整数',
            trigger: "blur",
          } 
        ]
      },
      // 富文本编辑器配置项
      setting: {
        height: '60vh',
        toolbar: 'undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |',
        toolbar_drawer: 'sliding',
        quickbars_selection_toolbar: 'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
        plugins: 'link image media table lists fullscreen quickbars',
        fontsize_formats: '12px 14px 16px 18px',
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true,
        // 以中文简体为例
        language: 'zh_CN',
        language_url: 'https://unpkg.com/@jsdawn/vue3-tinymce@1.1.6/dist/tinymce/langs/zh_CN.js'
      },
    }
  },
  components: {
    Vue3Tinymce
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表数据失败
    getGoodsList() {
      getGoodsList(this.query, this.pagenum, this.pagesize).then(res => {
        // console.log(res);
        if(res.data.meta.status !== 200) return this.$message.error('获取商品列表数据失败')
        this.goodsList = res.data.data.goods
        this.total = res.data.data.total
      })
    },
    // 切换每页显示多少条数据时执行的事件
    handleSizeChange(newSize) {
      this.pagesize = newSize
      this.getGoodsList()
    },
    // 页码改变时执行的事件
    handleCurrentChange(newPage) {
      this.pagenum = newPage
      this.getGoodsList()
    },
    // 判断搜索内容是否为空，若为空则不发起请求
    searchClick() {
      if(this.query == '') return this.$message.warning('请输入搜索内容')
      this.getGoodsList()
    },
    // 商品编辑点击事件
    editClick(id) {
      getGoodsInfo(id).then(res => {
        console.log(res);
        if(res.data.meta.status !== 200) return this.$message.error('获取商品信息失败')
        this.editForm = res.data.data
        this.editDialog = true
      })
    },
    // 商品列表编辑提交事件
    submitEditForm() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          setGoods(this.editForm.goods_id, this.editForm.goods_name, this.editForm.goods_price, this.editForm.goods_number, this.editForm.goods_weight, this.editForm.goods_introduce, this.editForm.pics, this.editForm.attrs, this.editForm.goods_cat).then(res => {
            console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message.error('修改商品信息失败')
            }
            this.$message.success('修改商品信息成功')
            this.editDialog = false
            this.getGoodsList()
          })
        } else {
          this.$message.warning('请检查商品参数信息是否填写完整')
          return false;
        }
      })
    },
    // 商品列表编辑重置事件
    resetEditForm() {
      this.$refs.editForm.resetFields();
    },
    // 点击文件列表中已上传的文件时的钩子，也就是图片预览事件
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.preVisible = true
    },
    // 文件列表移除文件时的钩子
    handleRemove(file) {
      // console.log(file);
      // 获取将要删除图片的临时路径
      const filePath = file.response.data.url
      // 在pics数组中找到这张图片对应的索引值
      const index = this.editForm.pics.findIndex(n => {
        n.pic === filePath
      })
      // 根据索引值使用splice删除该图片
      this.editForm.pics.splice(index, 1)
      if(file.response.meta.status !== 200) return this.$message.error('删除图片失败')
      this.$message.success('删除图片成功')
    },
    // 监听图片上传成功事件
    uploadSuccess(response) {
      // console.log(response);
      if (response.meta.status !== 200) return this.$message.error('上传图片失败')
      this.$message.success('上传图片成功')
      // 保存上传图片的临时路径
      const picInfo = {pics_sma_url: response.data.url}
      this.editForm.pics.push(picInfo)
      // console.log(this.addGoodsForm);
    },


    // 删除商品事件
    removeClick(id) {
      this.$confirm(
        '确认删除此商品吗 ？',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        deleteGoods(id).then(res => {
          // console.log(res);
          if (res.data.meta.status !== 200) return this.$message.error('删除商品失败')
          this.$message.success('删除商品成功')
          this.getGoodsList()
        })
      }).catch(() => {})
    },
    // 时间处理函数
    commentData(add_time) {
      const data = new Date(add_time * 1000);
      return formatDate(data, "yyyy-MM-dd hh:mm:ss");
    },
    // 添加商品点击事件
    addGoods() {
      this.$router.push('/addGoods')
    }
  }
}
</script>

<style lang="less" scoped>
.uploadImg {
  width: 100px;
  height: 100px;
  margin: 0 5px;
}
.preImg {
  width: 100%;
}
</style>