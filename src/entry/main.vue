<template>
  <div class="main">
    <ui-header></ui-header>
    <div class="mainContainer">
      <side-menu defautActive="1"></side-menu>
      <div class="right clearfix">
        <div class="middleContent fl">
          <el-row>
            <el-col :span="15"><home-personal :userInfo="userInfo" class="cpt"></home-personal></el-col>
            <el-col :span="9"><today-data class="cpt"></today-data></el-col>
          </el-row>
          <div class="charts">
            <smssend-cpt dataType="send" chartId="smsSend" name="短信发送量"></smssend-cpt>
            <smssend-cpt dataType="arrive" chartId="smsRate" name="到达统计率"></smssend-cpt>
          </div>
        </div>
        <div class="rightContent fl">
         <!-- <notice-cpt></notice-cpt>-->
         <!-- <smstest-cpt></smstest-cpt>-->
          <failreason-cpt></failreason-cpt>
          <smsdelay-cpt></smsdelay-cpt>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Select, Row, Col } from 'element-ui'
import Header from 'components/header/header'
import sideMenu from 'components/sideMenu/side'
import homePersonal from 'entry/home/personal'
import todayData from './home/todayData'
import noticeCpt from './home/noticeCpt'
import smstestCpt from './home/smstestCpt'
import failreasonCpt from './home/failreasonCpt'
import smsdelayCpt from './home/smsdelayCpt'
import smssendCpt from './home/smssendCpt'
import Services from 'common/js/services.js'

export default {
  name: 'app',
  data () {
    return {
      userInfo: {}
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
      })
    }
  },
  components: {
    uiHeader: Header, sideMenu, elRow: Row, elCol: Col, homePersonal, todayData, noticeCpt, smstestCpt, failreasonCpt, smssendCpt, smsdelayCpt
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .main
    height: 100%
  .mainContainer
    position: relative
    width: 100%
    height: 100%
    padding-left: 200px
    .right
      background-color : #f5f5f5
      .middleContent
        width: 70%
      .rightContent
        width: 30%
      .title
        padding: 10px 20px;
        font-size: 18px;
        color: #333;
        border-bottom: 1px solid #eae7e7
      .cpt
        background-color : #fff

</style>
