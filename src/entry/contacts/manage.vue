<template>
  <div class="contacts-content">
    <!--<v-title text="通讯录维护"></v-title>-->

    <el-row :gutter="10">
      <el-col :span="6">
        <div class="contact-group">

        <div class="group-head">
          <el-button type="primary" icon="plus" size="small" @click="modifyType=1;dialogGroupModifyVisible=true">新增</el-button>
        </div>
        <div class="contact-group-list"  v-loading="isloading">
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
          <el-button type="primary" icon="upload2" size="small" @click="dialogContactUploadVisible=true">导入</el-button>
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
    <el-dialog :title="modifyType==1 ? '新建通讯录组': '修改组名'" v-model="dialogGroupModifyVisible" size="tiny" >
      <el-form :model="groupForm" :rules="newGroupRules" ref="groupModify"  v-loading="isloading">
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
      <el-form :model="contactForm" :rules="contactRules" ref="contactModify"  v-loading="isloading" label-width="100px">
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

    <el-dialog title="通讯录导入" v-model="dialogContactUploadVisible" custom-class="contact-upload-dialog">
      <el-form :model="contactUploadForm" :rules="uploadRules" ref="contactUpload"  v-loading="isloading" label-width="100px">
        <el-form-item label="通讯录组" prop="group_id">
          <el-select v-model="contactUploadForm.group_id" placeholder="请选择通讯录组" >
            <el-option v-for="(group, idx) in groups" :key="group.id" :label="group.name" :value="group.id"></el-option>
          </el-select>
        </el-form-item>

        <div class="upload-wrap">
          <el-upload
                  class="upload-file"
                  :action="fileUploadUrl"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能csv文件，且不超过50M</div>
          </el-upload>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogContactUploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="contactUploadValidate('contactUpload')">确 定</el-button>
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
          color: #E8E658
        .el-icon-document
          color: rgb(77, 179, 255)
          margin-right : 5px
        .el-tree-node__content
          .operations
            color: rgb(77, 179, 255)
            display : none
            float: right

            .el-icon-plus, .el-icon-delete
              padding: 8px
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
  import { Table, Select, Option, Loading, TableColumn, Upload, MessageBox, Dialog, Form, FormItem, Tree, Button, Icon, Row, Col, Pagination, Input, Message } from 'element-ui'
  import vTitle from 'components/filters/vTitle'
  import vInput from 'components/filters/vInput'

  import Services from 'common/js/services.js'
  import _request from '../mixin/request.js'
  import _pagination from '../mixin/pagination.js'

  Vue.use(Loading.directive)
  Vue.prototype.$confirm = MessageBox.confirm

  Vue.component(Icon.name, Icon)
  Vue.component(Button.name, Button)

  let id = 1000
  export default {
    mixins: [_request, _pagination],
    data () {
      return {
        groups: [],
        selectedGroup: {},
        selectedContactList: [],
        isloading: false,
        isContactsLoading: false,
        modifyType: 1,
        contactModifyType: 1,
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
            { required: true, message: '手机号码不能为空', trigger: 'change' }
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
        fileUploadUrl: Services.fileUpload,
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
        },
        currentPage4: 2
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
        if (newGroup['id'] && newGroup['id'] !== oldGroup['id']) {
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
            } else {
              this.requestEditGroup(formName)
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
      groupSelect (data) {
        this.contactForm.group_id = data['id']
        this.contactUploadForm.group_id = data['id']
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
          this.$message({
            message: '添加成功'
          })
        })
      },
      // file
      getContactList () {
        let groupId = this.selectedGroup['id']
        this.request(Services.contactList, {group_id: groupId}, (remoteData) => {
          this.tableData = remoteData.data
        }, 'contacts')
      },
      contactUploadValidate (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // this.requestAddContact(formName)
          } else {
            return false
          }
        })
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePreview (file) {
        console.log(file)
      },
      requestEditContact (formName) {
        this.request(Services.contactEdit, this.contactForm, (remoteData) => {
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
        this.contactForm = this.selectedContactList[0]
      },
      deleteContact () {
        let contactData = this.selectedContactList[0]
        this.$confirm('确认要删除此通讯录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.request(Services.contactDelete, {
            id: contactData['id'],
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
        let icon = node.childNodes.length > 0 ? foldIcon : iconDocument
        return h('span', [
          h('span', [icon, node.label]),
          h('span', {
            class: {
              operations: true
            }
          }, [h('i', {
            class: {
              'el-icon-edit': true
            },
            style: {
              'display': data.isDelete === false ? 'none' : 'inline'
            },
            on: {
              click: this.editGroup.bind(this, data)
            }
          }), h('i', {
            class: {
              'el-icon-delete': true
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
      vTitle, elUpload: Upload, elSelect: Select, elOption: Option, MessageBox, Message, elInput: Input, elTable: Table, elDialog: Dialog, elTableColumn: TableColumn, vInput, elTree: Tree, elRow: Row, elCol: Col, elPagination: Pagination, elForm: Form, elFormItem: FormItem
    }
  }
</script>
