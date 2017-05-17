<template>
  <div class="sms-send-cpt cpt" v-loading="isloading">
    <div class="title"><a href="smsrecord.html#/send">{{name}}</a>
      <div class="dataType">
        <span class="week" :class="{'active': type=='week'}" @click="select('week')">周</span>
        <span class="linebar"></span>
        <span class="month" :class="{'active': type=='month'}" @click="select('month')">月</span>
      </div>
    </div>
    <div class="content">
      <div class="statistic-diagram"  id="smsSendData" data-highcharts-chart="2">
        <div class="highcharts-container" :id="chartId">
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
.sms-send-cpt
  .title
    .dataType
      float: right;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      .active
        color: #03a9f4;
      .linebar
        display: inline-block;
        vertical-align: top;
        width: 1px;
        height: 12px;
        margin: 2px 10px 0;
        background: #eae7e7;
  margin: 10px 10px 0 0;
  .content
    padding: 20px 20px 0
    .statistic-diagram
      height: 300px

</style>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import { Loading } from 'element-ui'
  import Services from 'common/js/services.js'
  import moment from 'moment'
  Vue.use(Loading.directive)
  import statisticMixin from '../mixin/statistic'

  const dateFormat = 'YYYY-MM-DD'
  export default {
    mixins: [statisticMixin],
    data () {
      return {
        type: 'week',
        isloading: false
      }
    },
    props: {
      chartId: String,
      dataType: String,
      name: String
    },
    created () {
      this.getSendData()
    },
    watch: {
      type () {
        this.getSendData()
      }
    },
    methods: {
      getSendData () {
        let type = this.type
        let num = type == 'week' ? 7 : 30
        let params = {
          start_date: moment().subtract(num, 'days').format(dateFormat),
          end_date: moment().subtract(1, 'days').format(dateFormat)
        }
        this.isloading = true
        let url = this.dataType == 'send' ? Services.dataHistoryeSend : Services.dataHistoryeArrive
        this.$http.jsonp(url, {
          params: params
        }).then((res) => {
          res = res.json()
          return res
        }).then((remoteData) => {
          this.isloading = false
          if (remoteData.code == 0) {
            console.log(remoteData)
            this.formatByType(remoteData.data)
          }
        })
      },
      formatByType (data) {
        if (this.dataType == 'send') {
          this.formatSend(data)
        } else if (this.dataType == 'arrive') {
          this.formatArrive(data)
        }
      },
      formatSend (data) {
        let ret = {
          ele: this.chartId,
          title: '',
          categories: [],
          series: [],
          height: 300,
          yFormat: '{value}条'
        }
        let lineObj = {
          name: '发送量',
          data: []
        }
        let tableData = []
        for (var k in data.list) {
          ret['categories'].push(k)
          lineObj['data'].push(data['list'][k]['send_total'])
          data['list'][k]['date'] = k
        }
        ret.series.push(lineObj)

        this.drawLine(ret)
      },
      formatArrive (data) {
        let ret = {
          ele: this.chartId,
          title: '',
          categories: [],
          series: [],
          height: 300,
          max: 100,
          yFormat: '{value}%',
          type: 'column'
        }
        let seriesOpt = {
          recv_success_total: {
            name: '成功',
            data: []
          },
          recv_fail_total: {
            name: '失败',
            data: []
          },
          recv_no_total: {
            name: '未知',
            data: []
          }
        }
        for (var k in data.list) {
          ret['categories'].push(k)
          for (var key in seriesOpt) {
            seriesOpt[key]['data'].push(data.list[k][key])
          }
          data['list'][k]['date'] = k
        }
        for (var t in seriesOpt) {
          ret.series.push(seriesOpt[t])
        }
        this.drawLine(ret)
      },
      select (val) {
        this.type = val
      }
    },
    components: {
      Loading
    }
  }
</script>
