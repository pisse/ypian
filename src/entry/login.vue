<template>
  <div class="main login">
    <ui-header></ui-header>
    <div class="login-wrap ">
      <div class="login-container">
      <div class="form-view"  v-loading="isloading">
        <div class="form-status">Q1069 云短信</div>

        <el-form :model="ruleForm" :rules="rules" ref="loginForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="账号" prop="username">
            <el-input v-model="ruleForm.username" @change="checkVcode"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" @keyup.13.native="submitForm('loginForm')"></el-input>
          </el-form-item>

          <template  v-if="is_captcha">
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="ruleForm.mobile"></el-input>
              <el-button class="code-btn" @click.prevent="getCode" :disabled="iscaptchaing">{{v_text != '获取验证码' ? v_text+'s' : v_text}}</el-button>
            </el-form-item>
            <el-form-item label="验证码" prop="captcha">
              <el-input  v-model="ruleForm.captcha"></el-input>
            </el-form-item>
          </template>

        </el-form>
        <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
      </div>
      <div class="desc">
        为您的每一条短信负责
      </div>
    </div>
    </div>
    <div class="footer">
      上海智鼎信息科技有限公司&copy; 沪ICP备
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
  .login
    background-color :#f6f6f6
  .login-wrap
    background-color : #f6f6f6
    padding-top: 30px
    .login-container
      position :relative
      width: 1200px
      height: 420px
      background-image : url('../assets/Login.png')
      background-repeat : no-repeat
      background-size : 100%
      margin: 0 auto
      padding: 25px 0;
      .form-view
        min-height : 375px
        margin-right : 20px
        float: right
        width: 400px
        padding: 0 37px;
        text-align :center
        border-top: 3px solid #03a9f4;
        background-color: white;
        box-shadow: 0 0 10px lightgrey;
        border-radius: 2px;
        position: relative;
        overflow: hidden
        .el-form-item
          border:1px solid rgb(191, 203, 217);
          .el-input__inner
            border: none
        .el-button
          width: 100%
          margin-bottom: 30px;
        .code-btn
          position : absolute
          padding: 0
          right: 2px
          width: 80px
          margin-bottom : 0
          top: 3px
          height: 30px
          line-height : 30px
        .form-status
          padding: 20px 0;
          font-size: 18px;

      .desc
        position :absolute
        color: #fff
        font-size : 30px
        left: 70px
        top: 165px
  .footer
    position : fixed
    height: 60px
    line-height : 60px
    bottom: 0px
    left: 0px
    right:0px
    text-align :center
    color: #999999
    font-size : 14px
    background-color :#fff
</style>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  // import { Form, FormItem, Input, Button, Loading, Message } from 'element-ui'
  import Header from 'components/header/loginHeader'

  import Services from 'common/js/services.js'

  // Vue.use(Loading.directive)
  // Vue.prototype.$message = Message
  // console.log(Message)

  export default {
    data () {
      var validateMobile = (rule, value, callback) => {
        if (!this.is_captcha || (this.is_captcha && value)) {
          callback()
        } else {
          callback(new Error('请输入手机号'))
        }
      }

      var validateCode = (rule, value, callback) => {
        if (!this.is_captcha || (this.is_captcha && value)) {
          callback()
        } else {
          callback(new Error('请输入验证码'))
        }
      }
      return {
        isloading: false,
        is_captcha: false,
        iscaptchaing: false,
        captcha_time: 0,
        v_text: '获取验证码',
        timer: null,
        ruleForm: {
          username: '',
          password: '',
          mobile: '',
          captcha: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' }
          ],
          mobile: [
            { required: true, validator: validateMobile, trigger: 'blur' }
          ],
          captcha: [
            { required: true, validator: validateCode, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submit()
          } else {
            return false
          }
        })
      },
      startCount () {
        if (this.v_text === 0) {
          this.v_text = '获取验证码'
          this.iscaptchaing = false
          return
        }
        // console.log(this.v_text)
        this.timer = setTimeout(() => {
          this.v_text = --this.v_text
          this.startCount()
        }, 1000)
      },
      getCode () {
        if (!this.ruleForm.mobile) {
          this.$message({
            type: 'error',
            message: '请输入手机号'
          })
          return
        }
        let params = {
          username: this.ruleForm['username'],
          password: this.ruleForm['password'],
          mobile: this.ruleForm['mobile']
        }

        this.captcha_time = ++this.captcha_time
        if (this.captcha_time > 3) {
          this.$message({
            type: 'error',
            message: '系统已经发送三条验证码，如果您没有收到，请联系客服处理。'
          })
          return
        }
        this.$http.jsonp(Services.getVcode, {
          params: params
        }).then((res) => {
          res = res.json()
          return res
        }).then((remoteData) => {
          if (remoteData.code === 0) {
            // window.location.href = 'main.html'
            this.$message({
              type: 'success',
              message: '验证码已发送'
            })
            this.iscaptchaing = true
            this.v_text = 60
            this.startCount()
          } else {
            this.$message({
              type: 'error',
              message: remoteData.message
            })
            this.iscaptchaing = false
          }
        })
      },
      checkVcode () {
        if (!this.ruleForm.username) {
          this.is_captcha = false
          return
        }
        this.isloading = true
        this.$http.jsonp(Services.checkVcode, {
          params: this.ruleForm
        }).then((res) => {
          res = res.json()
          return res
        }).then((remoteData) => {
          this.isloading = false
          if (remoteData.code === 0) {
            // window.location.href = 'main.html'
            this.is_captcha = remoteData.is_captcha
          } else {
            this.is_captcha = false
          }
        })
      },
      submit () {
        this.isloading = true
        this.$http.jsonp(Services.userLogin, {
          params: this.ruleForm
        }).then((res) => {
          res = res.json()
          return res
        }).then((remoteData) => {
          this.isloading = false
          if (remoteData.code === 0) {
            window.location.href = 'main.html'
          } else {
            this.$message({
              type: 'error',
              message: remoteData.message
            })
          }
        })
      }
    },
    components: {
      uiHeader: Header
      /* Loading,
      Message,
      uiHeader: Header,
      elForm: Form,
      elFormItem: FormItem,
      elInput: Input,
      elButton: Button */
    }
  }
</script>
