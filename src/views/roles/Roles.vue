<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="addRolesDialog=true">添加角色</el-button>
      <!-- 列表信息 -->
      <el-table :data="rolesList" border height="75vh" highlight-current-row stripe style="width: 100%">
        <!-- 角色列表扩展 -->
        <el-table-column type="expand" header-align="center" align="center">
          <template v-slot:default="expand">
            <el-row class="line" v-for="item in expand.row.children" :key="item">
              <el-col :span="4" class="el-col-m">
                <el-tag closable @close="removeTagClick(expand.row, item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row class="line" v-for="item in item.children" :key="item">
                  <el-col :span="4" class="el-col-m">
                    <el-tag type="success" closable @close="removeTagClick(expand.row, item.id)">{{item.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-tag type="warning"  v-for="item in item.children" :key="item" closable @close="removeTagClick(expand.row, item.id)">{{item.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" header-align="center" align="center" />
        <el-table-column prop="roleName" label="角色名称" header-align="center" />
        <el-table-column prop="roleDesc" label="角色描述" header-align="center" />
        <el-table-column label="操作" header-align="center" width="173px">
          <template v-slot:default="handle">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="small" @click="editClick(handle.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="small" @click="removeClick(handle.row.id)"></el-button>
            <!-- 分配权限按钮 -->
            <el-button type="warning" icon="el-icon-setting" size="small" @click="allotRightsClick(handle.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      v-model="addRolesDialog"
      title="添加角色"
      width="50%"
      :close-on-click-modal="false"
      @close="resetRolesForm"
    >
    <!-- 对话框内容 -->
      <el-form
        ref="addRolesForm"
        :model="addRolesForm"
        :rules="rules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addRolesDialog = false">取消</el-button>
          <el-button type="primary" @click="submitRolesForm"
            >确认</el-button
          >
          <el-button type="warning" @click="resetRolesForm">
            重置
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改角色信息对话框 -->
    <el-dialog
      v-model="editDialog"
      title="修改角色信息"
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
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
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
    <!-- 分配权限对话框 -->
    <el-dialog
      v-model="setRightsDialog"
      title="修改权限列表"
      width="50%"
      :close-on-click-modal="false"
      @close="resetDefKeys"
    >
    <!-- 对话框内容 树形控件 -->
       <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" accordion expand-on-click-node :default-checked-keys="defKeys" :default-expanded-keys="[101]" ref="treeRef" />
      <!-- 对话框底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRightsDialog = false">取消</el-button>
          <el-button type="primary" @click="submitRightsForm"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesList, addRoles, getRolesInfo, setRolesInfo, deleteRoles, deleteTag, allRightsList, setRightsList } from "network/rights"
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
      addRolesDialog: false,
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {},
      editDialog: false,
      setRightsDialog: false,
      rightsList: [],
      treeProps: {
        children: 'children',
        label: 'authName',
      },
      defKeys: [],
      rolesId: '',
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "角色名为2至10个字符",
            trigger: "blur",
          },
        ],
        roleDesc:[{}]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表信息
    getRolesList() {
      getRolesList().then(res => {
        // console.log(res);
        if (res.data.meta.status !== 200) return this.$message.error('获取角色列表失败')
        this.rolesList = res.data.data
      })
    },
    // 添加角色提交事件
    submitRolesForm() {
      this.$refs.addRolesForm.validate((valid) => {
        if (valid) {
          addRoles(this.addRolesForm.roleName, this.addRolesForm.roleDesc).then(res => {
            // console.log(res);
            if(res.data.meta.status !== 201) return this.$message.error('添加角色失败')
            this.$message.success('添加角色成功')
            this.getRolesList()
            this.addRolesDialog = false
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    },
    // 添加角色重置事件
    resetRolesForm() {
      this.$refs.addRolesForm.resetFields();
    },
    // 角色信息修改事件
    editClick(id) {
      getRolesInfo(id).then(res => {
        // console.log(res);
        if(res.data.meta.status !== 200) return this.$message.error('获取角色信息失败')
        this.editForm = res.data.data
        this.editDialog = true
      })
    },
    // 角色信息修改提交事件
    submitEditForm() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          setRolesInfo(this.editForm.roleId, this.editForm.roleName, this.editForm.roleDesc).then(res => {
            // console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message.error('修改用户信息失败')
            }
            this.editDialog = false
            // 添加成功后重新获取用户数据
            this.getRolesList()
            this.$message.success('修改用户信息成功')
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    },
      // 角色信息修改重置事件
    resetEditForm() {
      this.$refs.editForm.resetFields();
    },
    // 删除角色
    removeClick(id) {
      this.$confirm(
        '确认删除此角色吗 ？',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        deleteRoles(id).then(res => {
          // console.log(res);
          if (res.data.meta.status !== 200) return this.$message.error('删除角色失败')
          this.$message.success('删除角色成功')
          this.getRolesList()
        })
      }).catch(() => {})
    },
    // 删除角色权限标签
    removeTagClick(roleId, rightId) {
      this.$confirm(
        '确认删除该权限吗 ？',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        deleteTag(roleId.id, rightId).then(res => {
          console.log(res);
          if (res.data.meta.status !== 200) return this.$message.error('删除失败')
          this.$message.success('删除成功')
          roleId.children = res.data.data
        })
      }).catch(() => {})
    },
    // 分配权限事件
    allotRightsClick(roles) {
      allRightsList('tree').then(res => {
        // console.log(res);
        // 保存当前角色id以便下面权限提交时使用
        this.rolesId = roles.id
        if(res.data.meta.status !== 200) return this.$message.error('获取权限列表失败')
        this.rightsList = res.data.data
        this.getLeafKeys(roles, this.defKeys)
        this.setRightsDialog = true
      })
    },
    // 递归函数获取每个三级权限子节点的id存到一个数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => 
      this.getLeafKeys(item, arr))
    },
    // 分配权限提交事件
    submitRightsForm() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      // console.log(keys);
      const idStr = keys.join(',')
      // console.log(idStr);
      setRightsList(this.rolesId, idStr).then(res => {
        console.log(res);
        if(res.data.meta.status !== 200) return this.$message.error('修改权限失败')
        this.$message.success('修改权限成功')
        this.getRolesList()
        this.setRightsDialog = false
      })
    },
    // 分配权限的重置事件
    resetDefKeys() {
      this.defKeys = []
    }
  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
// .el-row {
//   // padding: 10px;
//   border-bottom: 1px solid #eee;
// }
.line {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 10px;
}
// .el-row:first-child {
//   border-top: 1px solid #eee;
// }
.el-col-m {
  text-align: center;
}
</style>