<template>
  <div class="sms-send-cpt cpt" v-loading="isLoading">
    <div class="title"><a :href="dataType==='send' ? 'statistic.html#/send' : 'statistic.html#/arrive'">{{name}}</a>
      <div class="dataType">
        <!--<span class="week" :class="{'active': type=='week'}" @click="select('week')">周</span>
        <span class="linebar"></span>
        <span class="month" :class="{'active': type=='month'}" @click="select('month')">月</span>-->
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
  // import { Loading } from 'element-ui'
  import Services from 'common/js/services.js'
  import moment from 'moment'
  // Vue.use(Loading.directive)
  import statisticMixin from '../mixin/statistic'
  import _request from '../../entry/mixin/request.js'

  const dateFormat = 'YYYY-MM-DD'
  export default {
    mixins: [statisticMixin, _request],
    data () {
      return {
        type: 'week',
        isLoading: false
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
          start_time: moment().subtract(num, 'days').format(dateFormat),
          end_time: moment().subtract(1, 'days').format(dateFormat)
        }
        this.isLoading = true
        let url = this.dataType == 'send' ? Services.dataHistoryeSend : Services.dataHistoryeArrive
        this.request(url, params, (remoteData) => {
          if (remoteData.code == 0) {
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
          type: 'spline',
          categories: [],
          series: [],
          height: 300,
          yFormat: '{value}'
        }
        let lineObj = {
          name: '发送量',
          data: []
        }
        let max = 0
        for (var k in data.list) {
          let num = data['list'][k]['send_total']
          if (num > max) {
            max = num
          }
          ret['categories'].push(k)
          lineObj['data'].push(num)
          data['list'][k]['date'] = k
        }
        ret['tickIntervalY'] = Math.round(max / 5)
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
          tooltipSuffix: '%',
          type: 'column'
        }
        let seriesOpt = {
          recv_success_total_rate: {
            name: '成功',
            data: []
          },
          recv_fail_total_rate: {
            name: '失败',
            data: []
          },
          recv_no_total_rate: {
            name: '未知',
            data: []
          }
        }
        for (var k in data.list) {
          ret['categories'].push(k)
          for (var key in seriesOpt) {
            seriesOpt[key]['data'].push(parseFloat(data.list[k][key]))
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
      // Loading
    }
  }
</script>
