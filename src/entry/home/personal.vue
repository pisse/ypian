<template>
  <div class="personal-info-cpt cpt">
    <div class="title"><a href="javascript:void(0);">个人信息</a></div>
    <div class="decs">
      <div class="person"></div>
      <div class="company">
        <div>
          <span class="name">{{userInfo.sp_name}}<!--上海酷昊信息技术有限公司--></span>
          <span class="level"><a href="javascript:void(0);">普通</a></span>
        </div>
        <div class="verify">
          <a href="javascript:void(0);" class="idverify"></a>
          <div class="line"></div>
          <a href="javascript:void(0);" class="phone"></a>
        </div>
      </div>
    </div>

    <div class="singleAccount">
      <div class="content">
        <div class="singleAccountInfo">
          <a href="javascript:void(0);">
            账户：{{userInfo.username}}
          </a>
          <span class="system">系统</span>
          <div class="newAccountDiv">
            <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
              <!--<a href="/dashboard/config/account#!/config/account/subAccount">新建子账号<span class="hoverIcon"></span></a>-->
            </el-tooltip>
          </div>
        </div>
        <div class="apikey">
          手机：<span>{{userInfo.phone}}</span>
          <!--<span class="showapikey hidekey"></span>-->
        </div>
      </div>
    </div>
    <div class="current-balance">
      <!--余额-->{{userInfo.title}}
      <div class="currentInfo">
      <span class="count">{{ userInfo.num}}<!--{{userInfo.balance | toFixed(2)}}--></span> <!--&nbsp;元-->
      <!--<charge-btn-cpt></charge-btn-cpt>-->
      <!--<div class="online-charge" _v-07a5aa8f="">
        <ui-button type="primary" size="small"> 充值</ui-button>
      </div>-->
    </div>
      <!-- <div class="change">显示条数</div>-->
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
.personal-info-cpt
  margin-right: 10px;
  height: 315px
  .decs
    padding: 20px
    .person
      float: left;
      width: 65px;
      height: 65px;
      background: url(../../assets/backindex1.png) no-repeat;
      background-position: -3px 0;
      background-size: 70px 110px
    .company
      margin-left: 85px;
      padding-top: 10px
      .name
        margin-right: 5px;
        color: #333
      .level
        margin-right: 10px;
        padding: 1px 5px;
        font-size: 12px;
        line-height: 12px;
        color: #fff;
        background: #fd8f00;
        border-radius: 10px
      .uplevel
        font-size: 12px;
        line-height: 12px;
        color: #03a9f4
    .verify
      margin-top: 15px
      .idverify
        display: inline-block;
        width: 25px;
        height: 20px;
        background: url(../../assets/backindex3.png?t=1) no-repeat;
        background-position: -25px 0;
        background-size: cover
        &.active
          background-position: 0 0
      .line
        display: inline-block;
        margin: 0 10px;
        width: 1px;
        height: 20px;
        background: #ccc
      .phone
        display: inline-block;
        width: 16px;
        height: 23px;
        background: url(../../assets/backindex3.png?t=1) no-repeat;
        background-position: -60px 0;
        background-size: cover
        &.disactive
          filter: grayscale(100%);
          filter: gray

  .current-balance
    padding: 30px 20px 20px 105px;
    color: #666
    .currentInfo
      display: inline-block
    .count
      //margin: 0 10px;
      // float: left;
      line-height: 30px;
      color: #333;
      font-size: 18px;
      font-weight: bold
    .online-charge
      display : inline-block
    .chargebtn
      display: inline-block;
      padding: 7px 20px;
      color: #fff;
      box-sizing: border-box;
      border-radius: 4px;
      background-color: #03a9f4;
      cursor: pointer
      &:hover
        background-color: #2cbfff
    .change
      font-size: 12px;
      line-height: 12px;
      margin: 10px 0 0 70px;
      color: #03a9f4;
      cursor: pointer
      &.show
        display: block
     .minConsume
       margin: 20px 0 0 70px


  .singleAccount
    //padding-top: 10px;
    margin-left: 85px;
    background: #f5f5f5
    .content
      padding: 10px 20px;
      background: #fff
    .system
      padding: 1px 5px;
      color: #fff;
      font-size: 12px;
      line-height: 12px;
      border-radius: 10px;
      margin-left : 5px
      background: #03a9f4
    .market
      background: #1abc9c
    .invalid
      background: #666
    .newAccountDiv
      display: inline-block;
      float: right
      a
        color: #03a9f4
     .newAccount
        display: inline-block;
        width: 13px;
        height: 13px;
        background: url(../../assets/icon_help.png);
        background-size: cover

  .apikey
    padding: 10px 0 0
    .showapikey
      display: inline-block;
      width: 24px;
      height: 16px;
      background: url(../../assets/backindex3.png?t=1) no-repeat;
      background-position: -60px 0;
      background-size: 107px;
      cursor: pointer
      &.hidekey
        background-position: -84px 0
</style>
<script type="text/ecmascript-6">
  // import { Button, Tooltip } from 'element-ui'
  import Utils from 'common/js/utils.js'

  export default {
    data () {
      return {}
    },
    filters: {
      toFixed (num, precision) {
        return Utils.formatDecimal(num, precision)
      }
    },
    props: {
      userInfo: Object
    },
    components: {
      // uiButton: Button, elTooltip: Tooltip
    }
  }
</script>
