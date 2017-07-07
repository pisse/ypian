<template>
  <div class="contacts-content">
    <!--<v-title text="通讯录维护"></v-title>-->

    <el-row :gutter="10" v-loading="isLoading">
      <el-col :span="6">
        <div class="contact-group">

        <div class="group-head">
          <el-button type="primary" icon="plus" size="small" @click="modifyType=1;dialogGroupModifyVisible=true">新增</el-button>
        </div>
        <div class="contact-group-list" >
          <el-tree
                  ref="groupTree"
                  highlight-current
                  :data="groupData"
                  :props="defaultProps"
                  node-key="id"
                  :current-node-key="selectedGroup.id"
                  default-expand-all
                  :expand-on-click-node="false"
                  :render-content="renderContent"
                  @node-click="groupSelect"
          >
          </el-tree>
        </div>
      </div>
      </el-col>
      <el-col :span="18">
        <div class="contact-list">
        <div class="list-head">
          <v-input :formData="searchForm" :opt="mobile" class="mobile-search" @icon_click="searchContact"></v-input>
          <el-button type="primary" icon="plus" size="small" @click="dialogContactModifyVisible=true">新增</el-button>
          <el-button type="primary" icon="edit" size="small" @click="modifyContact" :disabled="!isContactModifyEnable">修改</el-button>
          <el-button type="primary" icon="delete" size="small" @click="deleteContact" :disabled="!isContactDeleteEnable">删除</el-button>
          <el-button type="primary" icon="upload2" size="small" @click="uploadType=1;dialogContactUploadVisible=true">导入</el-button>
          <el-button type="primary" icon="upload2" size="small" @click="uploadType=2;dialogContactUploadVisible=true">剔除导入</el-button>
          <el-button type="primary" icon="arrow-down" size="small" @click="download">导出</el-button>

        </div>
        <el-table
                v-loading="isContactsLoading"
                @selection-change="handleSelectionChange"
                :data="tableData"
                stripe
                style="width: 100%">
          <el-table-column
                  type="selection"
                  width="55">
          </el-table-column>
          <el-table-column
                  prop="phone"
                  label="号码"
          >
          </el-table-column>
          <el-table-column
                  prop="name"
                  label="姓名"
          >
          </el-table-column>
          <el-table-column
                  prop="group_name"
                  label="通讯录组">
          </el-table-column>
        </el-table>

        <div class="block">
          <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="total">
          </el-pagination>
        </div>
      </div>
      </el-col>

    </el-row>
    <el-dialog :title="modifyType==1 ? '新建通讯录组': modifyType==2 ? '修改组名': '复制通讯录'" v-model="dialogGroupModifyVisible" size="tiny" >
      <el-form :model="groupForm" :rules="newGroupRules" ref="groupModify"  v-loading="isLoading">
        <el-form-item label="组名" label-width="60px" prop="name">
          <el-input v-model="groupForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupModifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="groupValidate('groupModify')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="contactModifyType==1 ? '新建通讯录': '修改通讯录'" v-model="dialogContactModifyVisible" custom-class="contact-dialog">
      <el-form :model="contactForm" :rules="contactRules" ref="contactModify"  v-loading="isLoading" label-width="100px">
        <el-form-item label="通讯录组" prop="group_id">
          <el-select v-model="contactForm.group_id" placeholder="请选择通讯录组" >
            <el-option v-for="(group, idx) in groups" :key="group.id" :label="group.name" :value="group.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="号码"  prop="phone">
          <el-input v-model="contactForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名"  prop="name">
          <el-input v-model="contactForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogContactModifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="contactValidate('contactModify')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="uploadType==1? '通讯录导入': '通讯录剔除导入'"
               v-model="dialogContactUploadVisible"
               :close-on-click-modal="false"
               custom-class="contact-upload-dialog">
      <el-form :model="contactUploadForm" :rules="uploadRules" ref="contactUpload"  v-loading="isUploadLoading" label-width="100px">
        <el-form-item label="通讯录组" prop="group_id">
          <el-select v-model="contactUploadForm.group_id" placeholder="请选择通讯录组" >
            <el-option v-for="(group, idx) in groups" :key="group.id" :label="group.name" :value="group.id"></el-option>
          </el-select>
        </el-form-item>

        <div class="upload-wrap">
          <el-upload
                  ref="contactUploadCpt"
                  class="upload-file"
                  with-credentials
                  :data="contactUploadForm"
                  :before-upload="beforeUpload"
                  :action="fileUploadUrl"
                  :on-preview="handlePreview"
                  :on-progress="handleProgress"
                  :on-remove="handleRemove"
                  :on-success="handleSuccessUpload"
                  :file-list="fileList">
            <el-button size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能csv文件，且不超过50M</div>
          </el-upload>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogContactUploadVisible = false">取 消</el-button>
        <el-button type="primary" :loading="isUploadLoading" @click="contactUploadValidate('contactUpload')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
  .tabs-wrap
    position : absolute
    left: 15px
    right: 0
  .contacts-content
    height : 100%
    padding-top : 50px
    .contact-group
      border-right : 2px solid rgb(223, 230, 236)
      .group-head
        border-bottom : 1px solid rgb(223, 230, 236)
        padding: 5px
      .el-tree
        border: 0
        .icon-folder3, .icon-folder2
          color: #fd8f00
          margin-right: 5px;
        .el-icon-document
          color: #1dc24e
          margin-right : 5px
        .el-tree-node__content
          .operations
            color: rgb(77, 179, 255)
            display : none
            float: right

            .el-icon-plus, .el-icon-delete
              padding: 8px
            .icon-fuzhi
              font-size : 14px
              margin-right : 5px
          &:hover
            .operations
              display : inherit
    .contact-list
      .list-head
        border: 1px solid rgb(223, 230, 236)
        border-bottom : 0
        line-height : 38px
      .mobile-search
        margin-right: 40px
      .input-wrap
        min-width: inherit
        width: 140px;
        .el-input__inner
          height: 28px
  .contact-dialog
    .el-input
      width: 200px
  .contact-upload-dialog
    .upload-wrap
      margin-left : 100px

</style>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  // import { Table, Select, Option, Loading, TableColumn, Upload, MessageBox, Dialog, Form, FormItem, Tree, Button, Icon, Row, Col, Pagination, Input, Message } from 'element-ui'
  import vTitle from 'components/filters/vTitle'
  import vInput from 'components/filters/vInput'

  import Services from 'common/js/services.js'
  import _request from '../mixin/request.js'
  import _pagination from '../mixin/pagination.js'

  // Vue.use(Loading.directive)
  // Vue.prototype.$confirm = MessageBox.confirm

  // Vue.component(Icon.name, Icon)
  // Vue.component(Button.name, Button)

  let id = 1000
  export default {
    mixins: [_request, _pagination],
    data () {
      function validatePhone (rule, value, callback) {
        if (!/^1[34578]\d{9}$/.test(value)) {
          callback(new Error('手机号格式不对。'))
        }
        callback()
      }
      return {
        groups: [],
        selectedGroup: {},
        selectedContactList: [],
        isLoading: false,
        isContactsLoading: false,
        modifyType: 1,
        contactModifyType: 1,
        uploadType: 1,
        fileUploadUrl: Services.fileUpload,
        dialogGroupModifyVisible: false,
        dialogContactModifyVisible: false,
        dialogContactUploadVisible: false,
        groupForm: {
          name: '',
          id: ''
        },
        contactForm: {
          id: '',
          group_id: '',
          phone: '',
          name: '',
          birthday: '',
          email: '',
          company_name: ''
        },
        contactUploadForm: {
          group_id: ''
        },
        newGroupRules: {
          name: [
            { required: true, message: '不能为空', trigger: 'change' }
          ]
        },
        contactRules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
            // { required: true, message: '手机号码不能为空', trigger: 'change' }
          ],
          group_id: [
            { required: true, message: '请选择通讯录组', trigger: 'change' }
          ]
        },
        uploadRules: {
          group_id: [
            { required: true, message: '请选择通讯录组', trigger: 'change' }
          ]
        },
        isUploadLoading: false,
        // fileUploadUrl: Services.fileUpload,
        searchForm: {
          phone: ''
        },
        mobile: {
          icon: 'search',
          name: '手机',
          key: 'phone',
          placeHolder: '请输入手机号'
        },
        tableData: [],
        fileList: [],
        groupData: [{
          id: 0,
          name: '通讯录组',
          isDelete: false,
          children: []
        }],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    computed: {
      isContactDeleteEnable () {
        return this.selectedContactList.length === 1
      },
      isContactModifyEnable () {
        return this.selectedContactList.length === 1
      }
    },
    watch: {
      selectedGroup (newGroup, oldGroup) {
        if (newGroup['id'] !== oldGroup['id']) {
          this.getContactList()
        }
      },
      currentPage () {
        this.getContactList()
      }
    },
    created () {
      this.getGroupList()
    },
    methods: {
      groupValidate (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.modifyType == 1) {
              this.requestAddGroup(formName)
            } else if (this.modifyType == 2) {
              this.requestEditGroup(formName)
            } else {
              this.requestCopyGroup(formName)
            }
          } else {
            return false
          }
        })
      },
      requestAddGroup (formName) {
        this.request(Services.contactGroupAdd, this.groupForm, (remoteData) => {
          this.dialogGroupModifyVisible = false
          this.$refs[formName].resetFields()
          this.getGroupList()
          this.$message({
            message: '添加成功'
          })
        })
      },
      requestEditGroup (formName) {
        this.request(Services.contactGroupEdit, this.groupForm, (remoteData) => {
          this.dialogGroupModifyVisible = false
          this.$refs[formName].resetFields()
          this.getGroupList()
          this.$message({
            message: '修改成功'
          })
        })
      },
      requestCopyGroup (formName) {
        this.request(Services.contactGroupCopy, this.groupForm, (remoteData) => {
          this.dialogGroupModifyVisible = false
          this.$refs[formName].resetFields()
          this.getGroupList()
          this.$message({
            message: '复制成功'
          })
        })
      },
      // group
      getGroupList () {
        this.request(Services.contactGroupList, {}, (remoteData) => {
          this.groups = remoteData.data
          this.groupData[0].children = remoteData.data
          this.selectedGroup = this.groups[0] || {}
        })
      },
      deleteGroup (data, event) {
        event.stopPropagation()
        this.$confirm('确认要删除此通讯录组?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.request(Services.contactGroupDelete, {id: data.id}, (remoteData) => {
            this.getGroupList()
            this.$message({
              message: '删除成功'
            })
          })
        }).catch(() => {
        })
      },
      editGroup (data, event) {
        event.stopPropagation()
        this.dialogGroupModifyVisible = true
        this.modifyType = 2
        this.groupForm.name = data.name
        this.groupForm.id = data.id
      },
      copyGroup (data, event) {
        event.stopPropagation()
        this.dialogGroupModifyVisible = true
        this.modifyType = 3
        this.groupForm.name = ''
        this.groupForm.id = data.id
      },
      groupSelect (data) {
        if (data['id'] != 0) {
          this.contactForm.group_id = data['id']
          this.contactUploadForm.group_id = data['id']
        }
        this.selectedGroup = data
      },
      contactValidate (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.contactModifyType == 1) {
              this.requestAddContact(formName)
            } else {
              this.requestEditContact(formName)
            }
          } else {
            return false
          }
        })
      },
      requestAddContact (formName) {
        this.request(Services.contactAdd, this.contactForm, (remoteData) => {
          this.dialogContactModifyVisible = false
          this.$refs[formName].resetFields()
          this.getContactList()
          this.$message({
            message: '添加成功'
          })
        })
      },
      // file
      getContactList () {
        let groupId = this.selectedGroup['id']
        this.request(Services.contactSearch, {group_id: groupId}, (remoteData) => {
          this.tableData = remoteData.data
          this.total = parseInt(remoteData.total)
        }, 'contacts')
      },
      contactUploadValidate (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // this.requestAddContact(formName)
            // this.$refs.contactUploadCpt.submit()
            this.requestUpladContact(formName)
          } else {
            return false
          }
        })
      },
      requestUpladContact (formName) {
        let url = this.uploadType === 1 ? Services.newContactUpload : Services.contactUploadSub
        this.request(url, this.contactUploadForm, (remoteData) => {
          this.dialogContactUploadVisible = false
          this.$refs[formName].resetFields()
          this.fileList = []
          this.getContactList()
          this.$message({
            message: remoteData.message
          })
        }, 'isUploadLoading')
      },
      handleRemove (file, fileList) {
        this.fileList = []
        this.contactUploadForm['file_name'] = ''
      },
      beforeUpload () {
        this.isUploadLoading = true
      },
      handleProgress () {},
      handlePreview (file) {
        console.log(file)
      },
      handleSuccessUpload (res, file, fileList) {
        this.isUploadLoading = false
        if (res.code == 0) {
          fileList.length > 1 && fileList.shift()
          let fileName = res.data.url
          this.contactUploadForm['file_name'] = fileName
          // this.fileMap[file['name']] = fileName
          // this.uploadFile = fileName
        }
      },
      requestEditContact (formName) {
        let oriContact = this.selectedContactList[0]
        let params = {
          id: oriContact['phone_id'],
          group_id: oriContact['group_id'],
          group_id_new: this.contactForm['group_id'],
          phone: this.contactForm['phone'],
          name: this.contactForm['name']
        }
        this.request(Services.contactEdit, params, (remoteData) => {
          this.dialogContactModifyVisible = false
          this.$refs[formName].resetFields()
          this.getContactList()
          this.$message({
            message: '修改成功'
          })
        })
      },
      handleSelectionChange (val) {
        this.selectedContactList = val
      },
      // contact
      searchContact () {
        let groupId = this.selectedGroup['id']
        let phone = this.searchForm['phone']
        this.request(Services.contactSearch, {group_id: groupId, phone: phone}, (remoteData) => {
          this.tableData = remoteData.data
        }, 'contacts')
      },
      modifyContact () {
        this.dialogContactModifyVisible = true
        this.contactModifyType = 2
        this.contactForm = Object.assign({}, this.selectedContactList[0])
        console.log(this.contactForm)
      },
      deleteContact () {
        let contactData = this.selectedContactList[0]
        this.$confirm('确认要删除此通讯录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.request(Services.contactDelete, {
            id: contactData['phone_id'],
            group_id: contactData['group_id']
          }, (remoteData) => {
            this.getContactList()
            this.$message({
              message: '删除成功'
            })
          })
        }, 'contacts').catch(() => {
        })
      },
      download () {
        let groupId = this.selectedGroup['id']
        if (!groupId) {
          this.$message({
            message: '请选择通讯录组'
          })
        } else {
          window.location.href = Services.contactDownload + '?group_id=' + groupId
        }
      },
      append (store, data) {
        store.append({ id: id++, label: 'testtest', children: [] }, data)
      },

      renderContent (h, {node, data, store}) {
        let iconFoldOpen = h('i', {
          class: {
            'iconfont': true,
            'icon-folder2': true
          }
        })
        let iconFolderClose = h('i', {
          class: {
            'iconfont': true,
            'icon-folder3': true
          }
        })
        let iconDocument = h('i', {
          class: {
            'el-icon-document': true
          }
        })

        let foldIcon = node.expanded ? iconFoldOpen : iconFolderClose
        let icon = (node.childNodes.length > 0 || data.id === 0) ? foldIcon : iconDocument
        return h('span', [
          h('span', [icon, node.label]),
          h('span', {
            class: {
              operations: true
            }
          }, [h('i', {
            class: {
              'iconfont': true,
              'icon-fuzhi': true
            },
            attrs: {
              title: '复制'
            },
            style: {
              'display': data.isDelete === false ? 'none' : 'inline'
            },
            on: {
              click: this.copyGroup.bind(this, data)
            }
          }), h('i', {
            class: {
              'el-icon-edit': true
            },
            style: {
              'display': data.isDelete === false ? 'none' : 'inline'
            },
            attrs: {
              title: '编辑'
            },
            on: {
              click: this.editGroup.bind(this, data)
            }
          }), h('i', {
            class: {
              'el-icon-delete': true
            },
            attrs: {
              title: '删除'
            },
            style: {
              'display': data.isDelete === false ? 'none' : 'inline'
            },
            on: {
              click: this.deleteGroup.bind(this, data)
            }
          })]
        )])
      }
    },
    components: {
      vTitle, vInput
    }
  }
</script>
