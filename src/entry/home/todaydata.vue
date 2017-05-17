<template>
  <div class="today-data-cpt">
    <div class="title"><a href="/dashboard/domestic/statistic#!/domestic/statistic/arrive">今日数据</a></div>
    <div class="content three">
      <div class="item item1">
        <span></span>今日发送条数
      </div>
      <div class="data">
        <a href="/dashboard/domestic/record#!/domestic/record/send">{{userInfo.total_message}}条</a>
      </div>
      <div class="item">
        <span class="span2"></span>到达率
      </div>
      <div class="data">
        <a href="/dashboard/domestic/statistic#!/domestic/statistic/arrive" class="rate">
          <span>成功{{userInfo.recv_success_total_rate}}</span>
          <span>失败{{userInfo.recv_fail_total_rate}}</span>
          <span>未知{{userInfo.recv_no_total_rate}}</span>
        </a>
      </div>
      <div class="item item3">
        <span class="span3"></span>请求失败数
      </div>
      <div class="data">
        <a href="/dashboard/smsFailure#!/smsFailure">{{userInfo.apply_total}}条</a>
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
    color: #666666
    span
      display: inline-block;
      margin-right: 10px;
      margin-top: 4px;
      width: 7px;
      height: 7px;
      vertical-align: top;
      border-radius: 50%
  .item1
    margin-top: 0
    span
      background: #1abc9c
  .span2
    background: #f39c12
  .span3
    background: #297cbb
  .span4
    background: #03a9f4
  .data
    padding: 10px 0 10px 17px;
    font-size: 14px;
    line-height: 14px
    a:hover
      color: #03a9f4
    .rate span
      margin-right: 10px
      &:last-child
        margin-right: 0
  .three .data
    padding: 20px 0 20px 17px

</style>
<script type="text/ecmascript-6">
  import { Button, Tooltip } from 'element-ui'
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
      uiButton: Button, elTooltip: Tooltip
    }
  }
</script>
