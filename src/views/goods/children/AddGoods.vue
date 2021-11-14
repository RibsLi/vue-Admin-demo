<template>
  <div class="add-goods">
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 提示信息 -->
      <el-alert title="请添加商品信息" type="success" show-icon :closable="false" center effect="dark"></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="parseInt(activeIndex)" finish-status="success" align-center >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <!-- tab选项卡 -->
      <el-form
        ref="addGoodsForm"
        :model="addGoodsForm"
        :rules="rules"
        label-width="70px"
        label-position="top"
      >
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="befTabLeave" @tab-click=tabClick>
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" type="number" placeholder="请输入商品价格"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" type="number" placeholder="请输入商品重量"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" type="number" placeholder="请输入商品数量"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="newCat">
              <el-cascader
                style="width:100%"
                v-model="addGoodsForm.newCat"
                :options="allCatList"
                :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children'}"
                placeholder="请选择商品分类"
                filterable
                @change="catChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyList" :key="item.attr_id">
              <el-checkbox-group v-model="checkList">
                <el-checkbox :label="item" border v-for="(item, index) in item.attr_vals" :key="index" />
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyList" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture-card"
              multiple
              :headers="headersObj"
              :on-success="uploadSuccess"
            >
              <!-- <el-button size="small" type="primary">点击上传</el-button> -->
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <vue3-tinymce v-model="addGoodsForm.goods_introduce" :setting="setting" />
            <el-button type="primary" @click="addGoodsClick">确认添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
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
import { getCatList } from "network/categories"
import { getParams } from "network/params"
import { addGoods } from "network/goods"

// 富文本编辑器插件
import Vue3Tinymce from '@jsdawn/vue3-tinymce'
// lodash插件用来做深浅拷贝
import _ from "lodash"

export default {
  name: "AddGoods",
  data() {
    return {
      activeIndex: '0',
      addGoodsForm: {
        // goods_id: '',
        goods_name: '',
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        newCat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      allCatList: [],
      manyList: [],
      onlyList: [],
      checkList: [],
      uploadURL: "https://lianghj.top:8888/api/private/v1/upload",
      // 自定义上传图片请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previewPath: '',
      preVisible: false,
      // 富文本编辑器配置项
      setting: {
        height: '60vh',
        toolbar:
          'undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |',
        toolbar_drawer: 'sliding',
        quickbars_selection_toolbar:
          'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
        plugins: 'link image media table lists fullscreen quickbars',
        fontsize_formats: '12px 14px 16px 18px',
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true,
        // 以中文简体为例
        language: 'zh_CN',
        language_url:
          'https://unpkg.com/@jsdawn/vue3-tinymce@1.1.6/dist/tinymce/langs/zh_CN.js'
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
            max: 30,
            message: "商品名称为2至30个字符",
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
        ],
        newCat: [
          {
            required: true,
            message: "请选择商品分类",
            trigger: "blur",
          }
        ]
      }
    }
  },
  components: {
    Vue3Tinymce
  },
  created() {
    this.getCatList()
  },
  methods: {
    getCatList() {
      // 获取所有三级分类信息
      getCatList('3', '', '').then(res => {
        // console.log(res);
        if(res.data.meta.status !== 200) return this.$message.error('获取分类列表失败')
        this.allCatList = res.data.data
      })
    },
    // 判断级联选择器选择结果是否包含三级分类
    catChange() {
      if(this.addGoodsForm.newCat.length == 0) {
        this.$message.warning('请先选择分类')
        this.addGoodsForm.newCat = []
      } else if(this.addGoodsForm.newCat.length == 3) {
        console.log('true');
      } else {
        this.$message.warning('只允许选择第三级分类')
        this.addGoodsForm.newCat = []
      }
    },
    // 切换标签之前的钩子函数
    befTabLeave(activeName, oldActiveName) {
      if(oldActiveName === '0' && this.addGoodsForm.newCat.length !== 3) {
        this.$message.error('请先填写或选择对应参数')
        return false
      }
      return true
    },
    // tab切换事件
    tabClick() {
      if (this.activeIndex === '1') {
        getParams(this.addGoodsForm.newCat[2], 'many').then (res => {
          // console.log(res);
          if(res.data.meta.status !== 200) return this.$message.error('获取参数数据失败')
          // 循环数据转换成数组以便后面使用
          res.data.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          })
          this.manyList = res.data.data
        })
      }
      if (this.activeIndex === '2') {
        getParams(this.addGoodsForm.newCat[2], 'only').then (res => {
          // console.log(res);
          if(res.data.meta.status !== 200) return this.$message.error('获取参数数据失败')
          this.onlyList = res.data.data
        })
      }
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
      const filePath = file.response.data.tmp_path
      // 在pics数组中找到这张图片对应的索引值
      const index = this.addGoodsForm.pics.findIndex(n => {
        n.pic === filePath
      })
      // 根据索引值使用splice删除该图片
      this.addGoodsForm.pics.splice(index, 1)
      if(file.response.meta.status !== 200) return this.$message.error('删除图片失败')
      this.$message.success('删除图片成功')
    },
    // 监听图片上传成功事件
    uploadSuccess(response) {
      // console.log(response);
      if (response.meta.status !== 200) return this.$message.error('上传图片失败')
      this.$message.success('上传图片成功')
      // 保存上传图片的临时路径
      const picInfo = {pic: response.data.tmp_path}
      this.addGoodsForm.pics.push(picInfo)
      // console.log(this.addGoodsForm);
    },
    // 确认添加商品事件
    addGoodsClick() {
      this.$refs.addGoodsForm.validate((valid) => {
        if (valid) {
          // 将动态参数和静态属性遍历加入到新数组attrs中
          this.manyList.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(',')
            }
            this.addGoodsForm.attrs.push(newInfo)
          })
          this.onlyList.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addGoodsForm.attrs.push(newInfo)
          })
          // 将addGoodsForm深拷贝，再将newCat数组转变成以逗号分割的字符串
          const form = _.cloneDeep(this.addGoodsForm)
          form.newCat = form.newCat.join(',')
          // 发起请求添加商品
          addGoods(form.goods_name, form.newCat, form.goods_price, form.goods_number, form.goods_weight, form.goods_introduce, form.pics, form.attrs).then(res => {
            // console.log(res);
            if (res.data.meta.status !== 201) {
              return this.$message.error('添加商品失败，请检查是否存在相同名称的商品')
            }
            this.$message.success('添加商品成功')
            this.$router.push("/goods");
          })
        } else {
          this.$message.warning('请检查商品参数信息是否填写完整')
          return false;
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.preImg {
  width: 100%;
}
.el-button {
  margin-top: 15px;
}
</style>