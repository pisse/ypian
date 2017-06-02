<template>
  <div class="batch-new">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <constant :opt="account"></constant>
      <br>
      <v-label :opt="account2"></v-label>
      <el-form-item label-width="130px" label="发送手机号:" prop="source" class="form-number" >
        <el-radio-group v-model="ruleForm.source" @change="sourceChange">
          <el-radio label="1">手动添加</el-radio>
          <el-radio label="2">Excel导入</el-radio>
          <el-radio label="3">通讯录导入</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="textarea-block">
        <el-input class="manual-ipt" v-if="ruleForm.source==1" type="textarea" v-model="ruleForm.manualIpt" @blur="manualValidate" placeholder="可填写多个手机号，用逗号分开"></el-input>
        <div class="upload-wrap"  v-else-if="ruleForm.source==2">
          <div class="file-wrap">
            <div class="down-template">
              1. <el-button type="primary" size="small" @click="downloadTemplate">下载模板文件</el-button>
              <span>填写手机号（还可填写变量）</span>
            </div>

            <el-upload
                    class="upload-number"
                    :action="fileUploadUrl"
                    :before-upload="handleBeforeUpload"
                    show-file-list
                    :on-remove="handleRemoveFile"
                    :on-success="handleSuccessUpload">
              2.
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">上传（小于15M且在100万行内）</div>
            </el-upload>
          </div>
        </div>
        <div class="contacts-list" v-else>
          <div class="contact-wrap" v-loading="isloading">
            <el-tree
                    ref="groupTree"
                    highlight-current
                    :data="groupData"
                    :props="defaultProps"
                    node-key="id"
                    :current-node-key="selectedGroup.id"
                    default-expand-all
                    :expand-on-click-node="false"
                    @node-click="groupSelect"
            >
            </el-tree>
          </div>
        </div>
        <div class="number-ipt-tip">
          <span  v-if="ruleForm.source==1">当前有效手机号共 {{manualCount}} 个</span>
          <span  v-if="ruleForm.source==2">当前上传文件为： {{uploadShowFile}}</span>
          <span  v-if="ruleForm.source==3">当前选中通讯录为： {{selectedGroup.name}}</span>
          <el-tooltip placement="bottom">
            <div slot="content">系统对上传的手机号做了自动去重和去除错误手机号，<br>剩下的是有效手机号，最少1个,建议10万个以内</div>
            <i class="iconfont icon-icon-question"></i>
          </el-tooltip>
        </div>
      </div>
      <el-form-item label-width="130px" label="短信签名 :" prop="sign">
        <el-select size="small" v-model="ruleForm.sign" placeholder="">
          <el-option v-for="(item, idx) in signInfo" :value="item" :key="idx"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label-width="130px"  label="发送内容:" prop="content">
        <div class="send-content-block">
          <el-input class="send-content" placeholder="请输入短信内容" type="textarea" v-model="ruleForm.content" @blur="contentValidate"></el-input>
          <div class="number-ipt-tip">
              <span>共 {{contentLength}} 个字符,<strong style="color:red;">{{smsCount}}</strong> 条短信
                <el-tooltip placement="bottom">
                  <div slot="content">如短信中含变量的，以实际发送字数为准，<br>默认变量为10个字。超过70字，按67字/条计算</div>
                  <i class="iconfont icon-icon-question"></i>
                </el-tooltip>
                </span>
              <span class="short-cut-link" @click="openShortLink">生成统计短链接</span>
          </div>
          <div class="phone-simulator">
            <div class="sms-content">
              {{ruleForm.sign}}{{ruleForm.content}}{{shortLinkForm.generated}}
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

      <el-form-item  label-width="130px"label="短信过滤:" prop="delivery">
        <el-checkbox v-model="checked2" disabled>过滤黑名单</el-checkbox>
      </el-form-item>

      <el-form-item label-width="130px" label="审核结果短信提醒:" prop="remind" class="form-number">
        <el-radio-group v-model="ruleForm.remind">
          <el-radio label="1">提醒</el-radio>
          <el-radio label="0">不提醒</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-alert
              title="人工审核会在30分钟内操作，请耐心等待。（工作时间：9：00~23：00）"
              type="info"
              :closable="false">
      </el-alert>
      <br>

      <el-form-item class="btn-wrap">
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>

    </el-form>

    <el-dialog title="生成统计短连接" v-model="dialogFormVisible" custom-class="short-link-dialog" size="small">
      <div class="desc">
        统计短链接服务帮您把长长的网址压缩，变成带统计功能的短链接。让您便于 控制短信长度，统计短信的点击量，更有助于优化短信发送时间、内容。 （本功能基于新浪微博短链接，云片不保证短链接可靠性）
      </div>
      <el-form :model="shortLinkForm" :rules="{}" ref="shortLinkForm">
        <el-form-item label="活动名称:" :label-width="formLabelWidth">
          <el-input size="small" v-model="shortLinkForm.name" placeholder="便于区分链接用途，20字以内" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="长链接（原网址）:" :label-width="formLabelWidth">
          <el-input size="small" v-model="shortLinkForm.url" placeholder="输入原网址，http/https开头" auto-complete="off"></el-input>
          <el-button size="small" type="primary" :loading="isGenerating" @click="genUrl">立即生成</el-button>
        </el-form-item>
        <el-form-item label="生成的统计短连接:" :label-width="formLabelWidth">
          <el-input size="small" v-model="shortLinkForm.generated" placeholder="短连接未生成"  :disabled="true" auto-complete="off"></el-input>
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
    .textarea-block
      margin-left: 130px
      width: 400px
      margin-bottom: 20px
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
        color: #00a0ff
        cursor: pointer
        line-height: 20px
        margin-top : -4px
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
      width: 300px
    .el-dialog__header
      text-align : center
    .desc
      padding: 5px 10px 20px 10px
</style>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import {
    Alert,
    Dialog,
    Tabs,
    Loading,
    TabPane,
    Form,
    FormItem,
    Checkbox,
    Radio,
    Tooltip,
    CheckboxGroup,
    MessageBox,
    Message,
    Switch,
    DatePicker,
    TimePicker,
    Option,
    Select,
    RadioGroup,
    Row,
    Col,
    Icon,
    Input,
    Button,
    Tree,
    Upload
  } from 'element-ui'
  import constant from 'components/filters/constant'
  import vLabel from 'components/filters/vLabel'
  import _ from 'lodash'

  import Services from 'common/js/services.js'
  Vue.use(Loading.directive)
  Vue.prototype.$alert = MessageBox.alert

  Vue.component(Icon.name, Icon)
  Vue.component(Button.name, Button)

  export default {
    data () {
      return {
        userInfo: {},
        signInfo: [],
        shortLinkForm: {
          name: '',
          url: '',
          generated: '',
          activity_id: ''
        },
        formLabelWidth: '130px',
        dialogFormVisible: false,
        account: {name: '发送账号', value: ''},
        account2: {name: '短信类型', value: '仅支持通知类短信,发营销短信请创建营销类子账号'},
        checked2: true,
        activeName: 'second',
        ruleForm: {
          name: '',
          sign: '',
          remind: '1',
          time: '',
          delivery: false,
          type: [],
          source: '1',
          manualIpt: '',
          sendType: '1',
          content: ''
        },
        manualIptErr: [],
        manualIptList: [],
        phoneBlackList: [],
        errPhoneShow: false,
        fileUploadUrl: Services.fileUpload,
        isloading: false,
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
        uploadFile: '',
        uploadShowFile: '',
        isGenerating: false,
        showShortTip: false,
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          sign: [
            {required: true, message: '请选择活动区域', trigger: 'change'}
          ],
          time: [
            {type: 'date', required: true, message: '请选择日期', trigger: 'blur'}
          ],
          type: [
            {type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change'}
          ],
          resource: [
            {required: true, message: '请选择活动资源', trigger: 'change'}
          ],
          content: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        },
        fileMap: {}
      }
    },
    computed: {
      manualCount () {
        return this.manualIptList.length
      },
      fileCount () {
        return 1
      },
      contentLength () {
        return this.ruleForm.sign.length + this.ruleForm.content.length
      },
      smsCount () {
        return Math.ceil(this.contentLength / 67)
      }
    },
    created () {
      this.getUserInfo()
    },
    methods: {
      getUserInfo () {
        this.$http.jsonp(Services.messageSignInfo, {
        }).then((res) => {
          res = res.json()
          return res
        }).then((remoteData) => {
          this.userInfo = remoteData.user_info || {}
          this.signInfo = remoteData.user_sign || {}
          this.ruleForm.sign = this.signInfo[0]
          this.account.value = this.userInfo.username
        })
      },
      downloadTemplate () {
        location.href = 'http://116.62.67.16/frontend/web/file/template/send_phone.csv'
      },
      phoneCheck (phones) {
        let ret = {
          errPhones: [],
          validPhones: []
        }
        for (var i = 0; i < phones.length; i++) {
          if (phones[i] && !(/^1[34578]\d{9}$/.test(phones[i]))) {
            ret['errPhones'].push(phones[i])
          } else {
            phones[i] && ret['validPhones'].push(phones[i])
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
        let manualIpts = this.phoneCheck(this.ruleForm.manualIpt.split(','))
        this.manualIptErr = manualIpts['errPhones']
        let validPhones = manualIpts['validPhones']
        if (validPhones.length > 0) {
          this.requestPost(Services.manualCheckPhone, {phones: validPhones.join()}, (res) => {
            this.phoneBlackList = res.data.black_mobile
            this.showInvalidPhones()
            this.manualIptList = this.clearManualPhone(validPhones, this.phoneBlackList)
            this.ruleForm.manualIpt = this.manualIptList.join(',')
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
      requestPost (url, data, callback) {
        Vue.http.options.emulateJSON = true
        this.$http.post(url, data, {
          credentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res = res.json()
          return res
        }).then((remoteData) => {
          if (remoteData.code === 0) {
            callback.call(this, remoteData)
          } else {
            Message({
              type: 'error',
              message: remoteData.message
            })
          }
        })
      },
      handleBeforeUpload (file) {
        if (/\.csv$/.test(file.name)) {
          return true
        } else {
          this.$alert('只能上传csv文件', '上传失败')
          return false
        }
      },
      handleRemoveFile (file) {
        delete this.fileMap[file.name]
      },
      handleSuccessUpload (res, file, fileList) {
        if (res.code == 0) {
          let fileName = res.data.url
          this.fileMap[file['name']] = fileName
          this.uploadFile = fileName
          this.uploadShowFile = file['name']
        }
      },
      sourceChange (v) {
        if (v == 3) {
          this.getGroupList()
        }
      },
      getGroupList () {
        this.isloading = true
        this.$http.jsonp(Services.contactGroupList, {
        }).then((res) => {
          res = res.json()
          return res
        }).then((remoteData) => {
          this.isloading = false
          if (remoteData.code === 0) {
            this.groups = remoteData.data
            this.groupData[0].children = remoteData.data
            this.selectedGroup = this.groups[0] || {}
          }
        })
      },
      groupSelect (data) {
        this.selectedGroup = data

        this.isloading = true
        this.$http.jsonp(Services.contactCheckPhone, {
          params: {
            group_id: data.id
          }
        }).then((res) => {
          res = res.json()
          return res
        }).then((res) => {
          this.isloading = false
          this.contactFile = res.data.file
        })
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
      openShortLink () {
        this.dialogFormVisible = true
        this.showShortTip = false
        // this.resetForm('shortLinkForm')
        this.shortLinkForm.name = ''
        this.shortLinkForm.url = ''
        this.shortLinkForm.generated = ''
      },
      genUrl () {
        this.isGenerating = true
        this.requestPost(Services.messageCreateShort, {title: this.shortLinkForm.name, long_url: this.shortLinkForm.url}, (res) => {
          this.isGenerating = false
          if (res.code === 0) {
            this.shortLinkForm.generated = res.data.short_link
            this.shortLinkForm.activity_id = res.data.activity_id
            this.showShortTip = true
          }
        })
      },
      handleClick (tab) {
        console.log(tab, event)
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let sendForm = {
              send_message: this.ruleForm.sign + this.ruleForm.content,
              send_message_type: this.ruleForm.sendType,
              send_message_time: parseInt(this.ruleForm.time.getTime() / 1000),
              activity_id: this.shortLinkForm.activity_id,
              send_phone_manual: this.ruleForm.manualIpt,
              send_phone_up_file: this.uploadFile,
              send_phone_list_file: this.contactFile,
              check_notice: this.ruleForm.remind
            }
            console.log(sendForm)
            if (sendForm['send_phone_manual'] || sendForm['send_phone_up_file'] || sendForm['send_phone_list_file']) {
              this.requestPost(Services.messageSend, sendForm, (res) => {
                this.$alert('创建成功', '', {
                  callback: action => {
                    this.$router.push({name: 'list'})
                  }
                })
              })
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
      vLabel,
      Icon,
      elTabs: Tabs,
      elDialog: Dialog,
      elTabPane: TabPane,
      elAlert: Alert,
      elForm: Form,
      elFormItem: FormItem,
      elCheckbox: Checkbox,
      MessageBox,
      Message,
      elRadio: Radio,
      elCheckboxGroup: CheckboxGroup,
      elSwitch: Switch,
      elDatePicker: DatePicker,
      elTimePicker: TimePicker,
      elOption: Option,
      elSelect: Select,
      elRadioGroup: RadioGroup,
      elRow: Row,
      elTooltip: Tooltip,
      elCol: Col,
      elTree: Tree,
      elInput: Input,
      elButton: Button,
      elUpload: Upload
    }
  }
</script>
