<template>
  <div class="today-data-cpt">
    <div class="title"><a href="javascript:void(0);">今日数据</a></div>
    <div class="content three">
      <div class="item item1">
        <span></span>今日发送条数
      </div>
      <div class="data">
        <a href="./smsrecord.html#/send">{{userInfo.total_message}}条</a>
      </div>
      <div class="item">
        <span class="span2"></span>到达率
      </div>
      <div class="data">
        <a href="./statistic.html#/arrive" class="rate">
          <span>成功{{userInfo.recv_success_total_rate}}</span>
          <span>失败{{userInfo.recv_fail_total_rate}}</span>
          <span>未知{{userInfo.recv_no_total_rate}}</span>
        </a>
      </div>
      <div class="item item3">
        <span class="span3"></span>请求失败数
      </div>
      <div class="data">
        <a href="./statistic.html#/fail">{{userInfo.apply_total}}条</a>
      </div>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
.today-data-cpt
  margin-right: 10px;
  height: 315px
  .content
    padding: 20px
  .item
    margin-top: 10px;
    span
      display: inline-block;
      margin-right: 10px;
      // margin-top: 4px;
      width: 18px;
      height: 18px;
      vertical-align: top;
      border-radius: 50%
      background-position: center;
      background-repeat : no-repeat;
      background-size : 100%;
      margin-top : -2px;
  .item1
    margin-top: 0
    span
      background-image : url('../../assets/success.png')
  .span2
    background-image : url('../../assets/arrive.png')
  .span3
    background-image : url('../../assets/fail.png')
  .span4
    background-image : url('../../assets/fail.png')
  .data
    padding: 10px 0 10px 28px;
    font-size: 14px;
    line-height: 14px
    a
      color: #666666
    a:hover
      color: #03a9f4
    .rate span
      margin-right: 10px
      &:last-child
        margin-right: 0
  .three .data
    padding: 20px 0 20px 28px

</style>
<script type="text/ecmascript-6">
  // import { Button, Tooltip } from 'element-ui'
  import Services from 'common/js/services.js'
  export default {
    data () {
      return {
        userInfo: {}
      }
    },
    created () {
      this.getTodayData()
    },
    methods: {
      getTodayData () {
        this.$http.jsonp(Services.controlTodayData, {
        }).then((res) => {
          res = res.json()
          return res
        }).then((remoteData) => {
          if (remoteData.code == 0) {
            this.userInfo = remoteData.data
          }
        })
      }
    },
    components: {
      // uiButton: Button, elTooltip: Tooltip
    }
  }
</script>
