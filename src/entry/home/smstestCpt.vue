<template>
  <div class="sms-test-cpt cpt">
    <div class="title">
      <a href="/dashboard/domestic/test#!/domestic/test/vcodeSMSTest">
        短信测试
      </a>
    </div>

    <div class="content">
      <div class="testcontent" >
        【智鼎网】您的验证码是 <span>4421</span>
      </div>

      <div class="mobilediv">
        手机号：
        <input class="mobile" type="text" placeholder="请输入一个正确手机号">
      </div>

      <div class="sendTo" id="smsTest">
        发送短信验证码
        <span class="timer " style="display:none;">
                (<span class="seconds">60</span>)
            </span>
      </div>
      <div class="message"></div>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
.sms-test-cpt
  // margin: 10px 0 0
  .content
    padding: 20px
    .testcontent
      margin-bottom: 10px;
      padding: 5px 20px;
      color: #666;
      background: #f5f5f5;
      cursor: pointer;
  .mobilediv
    .mobile
      margin-left: 10px;
      line-height: 30px;
      height: 30px;
      border: 1px solid lightgray;
      box-sizing: border-box;
      padding-left: 10px;
      font-size: 12px;
      width: 60%;
  .sendTo
    display: inline-block;
    margin: 10px 0 0 70px;
    padding: 7px 20px;
    color: #fff;
    box-sizing: border-box;
    border-radius: 4px;
    background-color: #03a9f4;
    cursor: pointer;
</style>
<script type="text/ecmascript-6">

  export default {
    data () {
      return {

      }
    },
    components: {
    }
  }
</script>
