<template>
  <div class="batch-new">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <constant :opt="account"></constant>
      <br>
     <!-- <v-label :opt="account2"></v-label>-->
      <el-form-item label-width="130px" label="发送手机号:" prop="phone_type" class="form-number" >
        <el-radio-group v-model="ruleForm.phone_type" @change="sourceChange">
          <el-radio label="1">手动添加</el-radio>
          <el-radio label="2">TXT导入</el-radio>
          <el-radio label="3">通讯录导入</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="textarea-block">
        <el-input class="manual-ipt" v-if="ruleForm.phone_type==1" type="textarea" v-model="ruleForm.manualIpt" @blur="manualValidate" placeholder="可填写多个手机号，用逗号分开"></el-input>
        <div class="upload-wrap"  v-else-if="ruleForm.phone_type==2">
          <div class="file-wrap">
            <div class="down-template">
              1. <el-button type="primary" size="small" @click="downloadTemplate">下载模板文件</el-button>
              <span>（每行一个手机号码）</span>
            </div>

            <el-upload
                    class="upload-number"
                    :action="fileUploadUrl"
                    :before-upload="handleBeforeUpload"
                    show-file-list
                    :file-list="fileList"
                    :on-remove="handleRemoveFile"
                    :on-success="handleSuccessUpload">
              2.
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">上传（小于15M且在100万行内）</div>
            </el-upload>
          </div>
        </div>
        <div class="contacts-list" v-else>
          <div class="contact-wrap" v-loading="isLoading">
            <div class="contact-empty" v-if="checkGroups.length ==0">---请在右侧选择通讯录---</div>
            <el-tag
                    v-else
                    v-for="(tag,idx) in checkGroups"
                    :key="tag.id"
                    :closable="true"
                    @close="removeContact(idx)"
                    type="primary"
            >
                          {{tag.name}}
            </el-tag>
            <!--<el-select v-model="contactIds" @change="contactChange" multiple placeholder="请选择">
              <el-option
                      v-for="item in groups"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
              </el-option>
            </el-select>-->
          </div>
        </div>
        <div class="number-ipt-tip">
          <span  v-if="ruleForm.phone_type==1">当前有效手机号共 {{manualCount}} 个</span>
          <span  v-if="ruleForm.phone_type==2">当前上传文件为： {{uploadShowFile}}</span>
          <span  v-if="ruleForm.phone_type==3">当前选中通讯录发送<!--{{selectedGroup.name}}，-->{{contactShowTip}}</span>
          <el-tooltip placement="bottom">
            <div slot="content">系统对上传的手机号做了自动去重和去除错误手机号<!--，<br>剩下的是有效手机号，最少1个,建议10万个以内--></div>
            <i class="iconfont icon-icon-question"></i>
          </el-tooltip>
        </div>
        <div class="contact-select-wrap" v-if="ruleForm.phone_type==3">
          <el-tree
                  ref="groupTree"
                  highlight-current
                  :data="groupData"
                  :props="defaultProps"
                  show-checkbox
                  node-key="id"
                  :current-node-key="selectedGroup.id"
                  default-expand-all
                  :expand-on-click-node="false"
                  @check-change="groupSelect"
                  @node-click="groupSelect"
          >
          </el-tree>
        </div>
      </div>

      <el-form-item label-width="130px" label="智能过滤 :" prop="filter_day" class="filters_days">
          <el-select size="small" v-model="ruleForm.filter_day" placeholder="" @change="filterDayChange">
              <el-option v-for="(item, idx) in filter_days" :label="item.label" :value="item.value" :key="idx"></el-option>
          </el-select>
          <span>{{filter_day_desc}}</span>
      </el-form-item>

      <el-form-item label-width="130px" label="短信签名:" prop="sign">
        <el-select size="small" v-model="ruleForm.sign" placeholder="">
          <el-option v-for="(item, idx) in signInfo" :value="item" :key="idx"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label-width="130px" label="营销分析:">
        <!--<el-switch on-text="" off-text=""  v-model="ruleForm.isopenShortUrl"></el-switch>-->
        <el-button type="primary" @click="openShortLink">点击率统计</el-button>
      </el-form-item>

      <el-form-item label-width="130px"  label="发送内容:" prop="content">
        <div class="send-content-block">
          <el-input class="send-content" placeholder="请输入短信内容" type="textarea" v-model="ruleForm.content" @blur="contentValidate"></el-input>
          <div class="number-ipt-tip">
              <span>共 {{contentLength}} 个字符,<strong style="color:red;">{{smsCount}}</strong> 条短信
                <el-tooltip placement="bottom">
                  <div slot="content"><!--如短信中含变量的，以实际发送字数为准，<br>默认变量为10个字。超过70字，按67字/条计算-->每条短信70个字，长短信为每条67个字。</div>
                  <i class="iconfont icon-icon-question"></i>
                </el-tooltip>
                </span>
              <span v-if="ruleForm.activity_id" class="short-cut-link remove-link" @click="removeShortLink">移除短链</span>
              <span class="short-cut-link" @click="openShortLink" >生成统计短链接</span>
          </div>
          <div class="phone-simulator">
            <div class="sms-content">
              {{ruleForm.sign}}{{ruleForm.content}}<!--{{shortLinkForm.generated}}-->
            </div>
          </div>
          <!--<div class="history-manager">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="最近发送记录" name="first">
                <div class="history-item">尊敬的用户，您的帐号于#time#成功充值#content#元，如有疑问请联系客服。</div>
                <div class="history-item">尊敬的用户，您的帐号于#time#成功充值#content#元，如有疑问请联系客服。</div>
                <div class="history-item">尊敬的用户，您的帐号于#time#成功充值#content#元，如有疑问请联系客服。</div>
              </el-tab-pane>
              <el-tab-pane label="已审模板" name="second">配置管理</el-tab-pane>
                <div class="history-item">
                  尊敬的用户，您的帐号于321成功充值342元，如有疑问请联系客服。
                </div>
            </el-tabs>
          </div>-->
        </div>
      </el-form-item>

      <el-form-item label-width="130px" label="发送时间:" prop="sendType" class="form-number">
        <el-radio-group v-model="ruleForm.sendType">
          <el-radio label="1">立即发送</el-radio>
          <el-radio label="2">定时发送</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="定时发送时间:"  label-width="130px" required v-if="ruleForm.sendType==2">

        <el-form-item prop="time" >
          <div class="el-date-editor-wrap">
            <el-date-picker type="datetime" size="small" placeholder="选择发送时间" v-model="ruleForm.time" style="width: 100%;"></el-date-picker>
          </div>
        </el-form-item>

      </el-form-item>

      <!--<el-form-item  label-width="130px"label="短信过滤:" prop="delivery">
        <el-checkbox v-model="checked2" disabled>过滤黑名单</el-checkbox>
      </el-form-item>-->

      <!--<el-form-item label-width="130px" label="审核结果短信提醒:" prop="remind" class="form-number">
        <el-radio-group v-model="ruleForm.remind">
          <el-radio label="1">提醒</el-radio>
          <el-radio label="0">不提醒</el-radio>
        </el-radio-group>
      </el-form-item>-->

      <el-alert
              title="人工审核会在30分钟内操作，请耐心等待。（工作时间：9：00~23：00）"
              type="info"
              :closable="false">
      </el-alert>
      <br>

      <el-form-item class="btn-wrap">
        <el-button type="primary" @click="onSubmit('ruleForm')">提交</el-button>
      </el-form-item>

    </el-form>

    <el-dialog title="短信点击率分析" v-model="dialogFormVisible" custom-class="short-link-dialog" size="small">
      <div class="desc">
        群发活动中加入短链接，让您便于统计短信的点击率，对比不同活动的用户点击行为与效果。
      </div>
      <el-form :model="shortLinkForm" :rules="{}" ref="shortLinkForm">
        <el-form-item label="活动名称:" :label-width="formLabelWidth">
          <el-input size="small" v-model="shortLinkForm.name" placeholder="便于区分链接用途，20字以内" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动链接:" :label-width="formLabelWidth">
          <el-input size="small" v-model="shortLinkForm.url" placeholder="输入原网址，http/https开头" auto-complete="off"></el-input>
          <el-button size="small" type="primary" :loading="isGenerating" @click="genUrl">立即生成</el-button>
        </el-form-item>
        <el-form-item label="统计链接:" :label-width="formLabelWidth">
          <el-input size="small" v-model="shortLinkForm.generated" placeholder="短连接未生成"  :disabled="!shortLinkForm.generated" auto-complete="off"></el-input>
        </el-form-item>
        <el-alert
                v-show="showShortTip"
                title="短连接生成成功，已插入到短信中"
                :closable="false"
                type="info">
        </el-alert>
      </el-form>
      <div slot="footer" class="dialog-footer">
      </div>
    </el-dialog>

    <el-dialog title="无效号码：" v-model="errPhoneShow">
      <el-row>
        <el-col :span="12" v-if="manualIptErr.length>0"><p>格式错误号码：</p><template v-for="(phone, idx) in manualIptErr"> <p>{{phone}}</p> </template></el-col>
        <el-col :span="12" v-if="phoneBlackList.length>0"><p>黑名单号码：</p><template v-for="(phone, idx) in phoneBlackList"> <p>{{phone}}</p> </template></el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errPhoneShow = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
            title="通讯录导入"
            v-model="dialogGroupVisible"
            size="small"
    >
      <span>已选择通讯录组：{{dialogGroupMsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogGroupVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
  .batch-new
    .constant-cpt
      .bar-name
        width: 130px
    .label-cpt
      .bar-name
        width: 130px
      .label-content-wrap
        width: inherit
    .form-number
      margin-bottom : 0
    .filters_days
      .el-input__inner
        width: 100px
    .textarea-block
      position :relative
      margin-left: 130px
      width: 400px
      margin-bottom: 20px
      .el-tag
        margin-right : 10px
        margin-bottom : 5px
      .contact-select-wrap
        position : absolute
        left: 450px
        top: 0
        max-height: 320px
        min-height: 110px
        width: 360px
        overflow: auto;
        border: 1px solid rgb(191, 203, 217);
        border-radius: 5px;
        .el-tree
          border : none
          .el-tree-node__label
            overflow: hidden
            text-overflow: ellipsis
            display: inline-block
            width: 200px
      .manual-ipt
        .el-textarea__inner
          min-height: 110px
      .upload-wrap
        .file-wrap
          padding: 5px
          border-radius : 4px
          border: 1px solid lightgrey
          min-height: 110px
          .down-template
            margin-bottom : 10px
          .upload-number
            .el-upload__tip
              margin-left : 10px
              display : inline-block
      .contacts-list
        min-height : 110px
        border-radius : 4px
        border: 1px solid lightgrey
        padding: 5px
        .contact-empty
          color: #999
    .textarea-block, .send-content-block
      width: 400px
      .number-ipt-tip
        padding: 2px 5px
        font-size: 12px
        color: #949494
        border: 1px solid #f0f0f0
        background-color: #f0f0f0
        line-height : 14px
        .icon-icon-question
          color: #03a9f4
          font-size : 14px
    .send-content-block
      position : relative
      .phone-simulator
        min-height: 150px;
        background-color: #f9f9f9;
        padding: 10px;
        margin-top: 10px;
        .sms-content
          background-color: #e6e5e9;
          border-radius: 10px;
          padding: 10px;
          word-break: break-all;
      .history-manager
        position : absolute
        left: 420px
        top: 0
        border-radius : 4px
        border: 1px solid rgb(191, 203, 217);
        .el-tabs__nav
          line-height : 31px
        .el-tabs__header
          border-bottom : 2px solid #2cbfff
          margin : 0
        .el-tabs__content
          height : 258px
          overflow : auto
          .history-item
            padding: 5px 20px 20px 5px;
            position: relative;
            cursor: pointer;
            word-break: break-all;
            &:hover
              background-color: #03a9f4;
              color: white;
        .el-tabs__item
          color: black
          height: 31px
          line-height : 31px
          padding: 0 30px
          &.is-active
            background-color: #2cbfff;
            color: white;
            border-color: #2cbfff;
      .short-cut-link
        float: right
        display : inline-block
        color: #00a0ff
        cursor: pointer
        line-height: 20px
        margin-top : -4px
        &.remove-link
          margin-left : 10px
    .send-content
      width: 400px
      .el-textarea__inner
        min-height :110px
    .btn-wrap
      padding-top: 10px
      border-top: 1px solid #eae7e7
    .el-date-editor-wrap
      width: 200px

  .short-link-dialog
    .el-input
      max-width: 300px
    .el-dialog__header
      text-align : center
    .desc
      padding: 5px 10px 20px 10px
</style>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import constant from 'components/filters/constant'
  import vLabel from 'components/filters/vLabel'
  import _ from 'lodash'
  import _request from '../mixin/request'
  import Services from 'common/js/services.js'
  // Vue.use(Loading.directive)
  // Vue.prototype.$alert = MessageBox.alert

  // Vue.component(Icon.name, Icon)
  // Vue.component(Button.name, Button)

  export default {
    mixins: [_request],
    data () {
      return {
        userInfo: {},
        signInfo: [],
        signNos: [],
        filter_days: [{value: '0', label: '不过滤'}, {value: '1', label: '1天'}, {value: '3', label: '3天'}, {value: '7', label: '7天'}, {value: '30', label: '30天'}],
        filter_day_desc: '（启用过滤功能将避免频繁发送短信给用户）',
        shortLinkForm: {
          name: '',
          url: '',
          generated: ''
        },
        formLabelWidth: '130px',
        dialogFormVisible: false,
        account: {name: '发送账号', value: ''},
        account2: {name: '短信类型', value: '仅支持通知类短信,发营销短信请创建营销类子账号'},
        checked2: true,
        activeName: 'second',
        ruleForm: {
          activity_id: '',
          activity_url: '',
          name: '',
          sign: '',
          sign_id: '',
          remind: '1',
          isopenShortUrl: false,
          time: '',
          delivery: false,
          phone_type: '1',
          mobile_total: 0,
          total_message: 0,
          manualIpt: '',
          sendType: '1',
          filter_day: '0',
          content: ''
        },
        manualIptErr: [],
        manualIptList: [],
        phoneBlackList: [],
        errPhoneShow: false,
        fileUploadUrl: Services.fileTaskUp,
        fileList: [],
        dialogGroupVisible: false,
        dialogGroupMsg: '',
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
        selectedGroup: {},
        contactFile: '',
        groups: [],
        checkGroups: [],
        contactIds: [],
        uploadFile: '',
        uploadShowFile: '',
        contactShowTip: '',
        isGenerating: false,
        showShortTip: false,
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          sign: [
            // {required: true, message: '请选择签名', trigger: 'change'}
          ],
          filter_day: [],
          time: [
            {type: 'date', required: true, message: '请选择日期', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        },
        fileMap: {}
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.tabs.forEach((v, i) => {
          if (v['name'] == 'taskdetail') {
            v['show'] = false
          } else {
            v['show'] = true
          }
        })
        vm.getUserInfo()
      })
    },
    props: {
      tabs: Array
    },
    computed: {
      manualCount () {
        return this.manualIptList.length
      },
      fileCount () {
        return 1
      },
      contentLength () {
        return this.ruleForm.sign.length + this.ruleForm.content.length // + this.shortLinkForm.generated.length
      },
      smsCount () {
        return this.contentLength <= 70 ? 1 : Math.ceil(this.contentLength / 67)
      }
    },
    created () {
      // this.getUserInfo()
    },
    methods: {
      getUserInfo () {
        this.request(Services.messageSignInfo, {
        }, (remoteData) => {
          this.userInfo = remoteData.data.user_info || {}
          this.signInfo = _.values(remoteData.data.user_sign || {}) || []
          this.signNos = _.keys(remoteData.data.user_sign || {})

          this.ruleForm.sign = this.signInfo[0] || ''
          this.account.value = this.userInfo.username
        })
      },
      downloadTemplate () {
        location.href = 'http://sms.q1069.com/file/template/send_phone.csv'
      },
      phoneCheck (phones) {
        let ret = {
          errPhones: [],
          validPhones: []
        }
        for (var i = 0; i < phones.length; i++) {
          let mobile = _.trim(phones[i])
          if (mobile && !(/^1[34578]\d{9}$/.test(mobile))) {
            ret['errPhones'].push(mobile)
          } else {
            mobile && ret['validPhones'].push(mobile)
          }
        }
        ret['validPhones'] = _.uniq(ret['validPhones'])
        return ret
      },
      resetManualIpt () {
        this.manualIptList = []
        this.phoneBlackList = []
        this.manualIptErr = []
      },
      manualValidate () {
        this.resetManualIpt()
        this.ruleForm.manualIpt = _.trim(this.ruleForm.manualIpt).replace(/\s+/g, ',').replace(/，/g, ',')

        let manualIpts = this.phoneCheck(this.ruleForm.manualIpt.split(','))
        this.manualIptErr = manualIpts['errPhones']
        let validPhones = manualIpts['validPhones']
        if (validPhones.length > 0) {
          this.requestPost(Services.manualCheckPhone, {phones: validPhones.join()}, (res) => {
            this.phoneBlackList = res.data.black_mobile
            this.showInvalidPhones()
            this.manualIptList = this.clearManualPhone(validPhones, this.phoneBlackList)
            this.ruleForm.manualIpt = this.manualIptList.join(',')
            this.ruleForm.mobile_total = res.data.mobile_total || 0
          })
        } else {
          this.showInvalidPhones()
          this.ruleForm.manualIpt = ''
        }
      },
      clearManualPhone (ori, blackList) {
        for (let i = 0; i < blackList.length; i++) {
          var idx = ori.indexOf(blackList[i])
          if (idx > -1) {
            ori.splice(idx, 1)
          }
        }
        return ori
      },
      showInvalidPhones () {
        if (this.manualIptErr.length > 0 || this.phoneBlackList.length > 0) {
          this.errPhoneShow = true
        }
      },
      handleBeforeUpload (file) {
        if (/\.(csv|txt)$/.test(file.name)) {
          return true
        } else {
          this.$alert('只能上传csv,txt文件', '上传失败')
          return false
        }
      },
      handleRemoveFile (file) {
        this.fileList = []
        this.uploadFile = ''
        this.uploadShowFile = ''
        this.ruleForm.mobile_total = ''
        delete this.fileMap[file.name]
      },
      handleSuccessUpload (res, file, fileList) {
        if (res.code == 0) {
          fileList.length > 1 && fileList.shift()

          let fileName = res.data.file
          this.fileMap[file['name']] = fileName
          this.uploadFile = fileName
          this.uploadShowFile = file['name'] + '，导入:' + res.data.total + ',成功:' + res.data.success + ',失败:' + res.data.fail
          this.ruleForm.mobile_total = res.data.success || 0
        }
      },
      sourceChange (v) {
        if (v == 3) {
          this.getGroupList()
        }
      },
      getGroupList () {
        this.request(Services.contactGroupList, {
        }, (remoteData) => {
          if (remoteData.code === 0) {
            this.groups = remoteData.data
            this.groupData[0].children = remoteData.data
            this.checkGroups = []
            this.contactIds = []
            // this.selectedGroup = this.groups[0] || {}
            // this.groupSelect(this.groups[0] || {})
          }
        })
      },
      groupSelect (data) {
        // console.log(data)
        let checkedNodes = this.$refs.groupTree.getCheckedNodes()
        this.checkGroups = checkedNodes.filter((item, idx) => {
          return item.id != 0
        })
        // console.log(checkedNodes)
        if (this.checkGroups.length === 0) {
          return
        }
        this.contactIds = this.checkGroups.map((item, idx) => {
          return item.id
        })
        this.request(Services.contactTotalNum, {
          group_id: this.contactIds.join()
        }, (res) => {
          // this.showGroupDialog(res.data)
          // this.contactFile = res.data.file
          this.contactShowTip = '，共导入' + this.contactIds.length + '个组，' + res.data.total + '个号码' // + ',成功:' + res.data.success + ',失败:' + res.data.fail
          this.ruleForm.mobile_total = res.data.total || 0
        })
      },
      removeContact (idx) {
        this.checkGroups.splice(idx, 1)
        this.contactIds.splice(idx, 1)
        this.$refs.groupTree.setCheckedNodes(this.checkGroups)
      },
      filterDayChange (day) {
        if (day == 0) {
          this.filter_day_desc = '（启用过滤功能将避免频繁发送短信给用户）'
        } else {
          this.filter_day_desc = '（最近' + day + '天发送过的用户，本次活动将不再发送）'
        }
      },
      contactChange (values) {
        console.log(values)
      },
      showGroupDialog (data) {
        this.dialogGroupVisible = true
        let msg = this.selectedGroup.name + '，导入:' + data.total + ',成功:' + data.success + ',失败:' + data.fail
        this.dialogGroupMsg = msg
      },
      contentValidate () {
        if (this.ruleForm.content) {
          this.requestPost(Services.messageContentCheck, {send_message: this.ruleForm.content}, (res) => {
            if (res.code !== 0) {
              this.$alert(res.message, '含有敏感词汇')
            }
          })
        }
      },
      openShortLink (val) {
        if (val) {
          this.dialogFormVisible = true
          this.showShortTip = false
          // this.resetForm('shortLinkForm')
          this.shortLinkForm.name = ''
          this.shortLinkForm.url = ''
          this.shortLinkForm.generated = ''
          // this.shortLinkForm.activity_id = ''
        }
      },
      removeShortLink () {
        this.shortLinkForm.name = ''
        this.shortLinkForm.url = ''
        this.shortLinkForm.generated = ''

        this.ruleForm.content = this.ruleForm.content.replace(this.ruleForm.activity_url, '')
        this.ruleForm.activity_id = ''
        this.ruleForm.activity_url = ''
      },
      genUrl () {
        this.isGenerating = true
        let url = this.shortLinkForm.url.indexOf('http://') == -1 ? ('http://' + this.shortLinkForm.url) : this.shortLinkForm.url
        this.requestPost(Services.messageCreateShort, {title: this.shortLinkForm.name, long_url: url}, (res) => {
          this.isGenerating = false
          if (res.code === 0) {
            let short_url = res.data.short_link.replace(/^http(s?):\/\//, '')
            this.shortLinkForm.generated = short_url
            // insert shortUrl to sms content
            if (this.ruleForm.activity_id) {
              this.ruleForm.content = this.ruleForm.content.replace(this.ruleForm.activity_url, this.shortLinkForm.generated)
            } else {
              this.ruleForm.content += this.shortLinkForm.generated
            }
            this.ruleForm.activity_id = res.data.activity_id
            this.ruleForm.activity_url = short_url
            this.showShortTip = true
          }
        }, 'isGenerating')
      },
      handleClick (tab) {
        console.log(tab, event)
      },
      onSubmit (formName) {
        this.$nextTick(() => {
          this.submitForm(formName)
        })
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (this.ruleForm.phone_type == 3 && this.contactIds.length == 0) {
            this.$alert('请选择通讯录组', '创建失败')
            return
          }
          if (valid) {
            let sendForm = {
              send_message: this.ruleForm.sign + this.ruleForm.content, // + this.shortLinkForm.generated,
              send_message_type: this.ruleForm.sendType,
              send_message_time: this.ruleForm.sendType == 2 ? parseInt(this.ruleForm.time.getTime() / 1000) : '',
              activity_id: this.ruleForm.activity_id,
              send_phone_manual: this.ruleForm.manualIpt,
              send_phone_up_file: this.uploadFile,
              send_phone_list_file: this.contactIds.join(), // this.contactFile,
              check_notice: this.ruleForm.remind,
              phone_type: this.ruleForm.phone_type,
              // total_message: this.ruleForm.mobile_total * this.smsCount,
              phone_count: this.ruleForm.mobile_total,
              filter_day: this.ruleForm.filter_day,
              message_count: this.smsCount,
              sign_id: this.signNos[this.signInfo.indexOf(this.ruleForm.sign)]
            }

            if (sendForm['send_phone_manual'] || sendForm['send_phone_up_file'] || sendForm['send_phone_list_file']) {
              this.requestPost(Services.messageSend, sendForm, (res) => {
                this.$refs['ruleForm'].resetFields()
                this.$alert('创建成功', '', {
                  callback: action => {
                    this.$router.push({name: 'list'})
                  }
                })
              }, '', true)
            } else {
              this.$alert('手机号为空', '创建失败')
            }
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    },
    components: {
      constant,
      vLabel
    }
  }
</script>
