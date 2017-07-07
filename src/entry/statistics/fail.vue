<template>
  <div class="statistic-send">
    <div class="search-box">
      <v-radio :formData="formData" :opt="types"></v-radio>
      <br/>
      <template  v-if="formData.statistic_type == 'history'">
        <date-picker :formData="formData"  type="date" :opt="dataRange" dateFormat="yyyy-MM-dd"></date-picker>
        <br>
      </template>

      <constant :opt="account"></constant>
      <br/>
      <v-button text="查询" :loading="isLoading" @search="search"></v-button>
      <v-title text="失败原因概览"></v-title>

      <div class="charts-wrap">
        <div id="chart" ref="chartDiv"></div>
      </div>

      <div class="table-wrap" >
        <v-title text="失败原因统计"></v-title>
        <!--<div class="table-operations">
          <span class="download" @click="download"><i class="iconfont icon-download"></i>导出数据</span>
        </div>-->
        <el-table
                :data="tableData"
                stripe
                style="width: 100%">
          <el-table-column
                  prop="reason"
                  label="错误原因"
          >
          </el-table-column>
          <el-table-column
                  prop="reason_total"
                  label="数量">
          </el-table-column>
          <el-table-column
                  prop="rate"
                  label="占比	">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
  .charts-wrap
    margin-top : 25px
  .table-wrap
    margin-bottom 30px
    .table-operations
      text-align : right
      height: 40px
      line-height : 40px
      .download
        margin: 0 20px
        cursor : pointer
</style>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  // import { Alert, DatePicker, Loading, Table, TableColumn, Pagination, MessageBox } from 'element-ui'
  import constant from 'components/filters/constant'
  import datePicker from 'components/filters/datePicker'
  import vButton from 'components/filters/vButton'
  import vTitle from 'components/filters/vTitle'
  import vRadio from 'components/filters/vRadio'

  import moment from 'moment'

  import statisticMixin from '../mixin/statistic'
  import Services from 'common/js/services.js'
  import _request from '../mixin/request'
  import _pagination from '../mixin/pagination'
  // Vue.use(Loading.directive)
  // Vue.prototype.$alert = MessageBox.alert

  // Vue.use(Loading.directive)

  const dateFormat = 'YYYY-MM-DD'
  export default {
    mixins: [statisticMixin, _request, _pagination],
    data () {
      return {
        account: {name: '账户名', value: ''},
        types: {
          name: '统计类型',
          key: 'statistic_type',
          items: [{label: '实时统计（今日）', val: 'realtime'}, {label: '历史统计', val: 'history'}]
        },
        dataRange: {
          name: '起止时间',
          keyStart: 'start_time',
          keyEnd: 'end_time',
          desc: '可查询三个月内记录'
        },
        formData: {
          statistic_type: 'realtime',
          start_time: moment().subtract(7, 'days').format(dateFormat),
          end_time: moment().subtract(1, 'days').format(dateFormat)
        },
        tableData: []
      }
    },
    props: {
      userInfo: Object
    },
    watch: {
      userInfo (newVal) {
        this.account.value = newVal['username']
        // this.formData.user_id = newVal['user_id']
      }
    },
    created () {
      this.search()
      this.setWatch()
      this.account.value = this.userInfo['username']
      this.setRealtimeTimeout()
    },
    methods: {
      setRealtimeTimeout () {
        if (this.realTimeout) {
          clearTimeout(this.realTimeout)
          this.realTimeout = null
        }
        this.realTimeout = setTimeout(() => {
          if (this.formData.statistic_type == 'realtime') {
            this.search()
          }
          this.setRealtimeTimeout()
        }, 1000 * 10 * 60)
      },
      setWatch () {
        this.$watch('formData.statistic_type', (v, o) => {
          if (v != o) {
            this.search()
          }
        })
      },
      search () {
        let url = this.formData.statistic_type == 'realtime' ? Services.dataRealtimeFail : Services.dataHistoryeFail
        let params = Object.assign({}, this.formData)
        params['start_time'] = moment(params['start_time']).format(dateFormat)
        params['end_time'] = moment(params['end_time']).format(dateFormat)
        this.request(url, params, (remoteData) => {
          if (remoteData.code == 0) {
            this.formatLineData(remoteData.data)
          }
        })
      },
      formatLineData (data) {
        let type = this.formData.statistic_type
        if (type == 'realtime') {
          this.formatRealtime(data)
        } else {
          this.formatRealtime(data)
        }
      },
      formatRealtime (data) {
        if (!data || data.length == 0) {
          this.$refs.chartDiv.innerHTML = '<div class="empty"> 暂无数据</div>'
          return
        }
        let ret = {
          ele: 'chart',
          categories: [],
          series: [],
          type: 'pie',
          height: 300,
          tickInterval: 3,
          tooltipSuffix: '%'
        }
        let lineObj = {
          name: '失败占比',
          data: [],
          type: 'pie'
        }
        let tableData = []
        for (var k in data) {
          lineObj['data'].push([data[k]['reason'], parseFloat(data[k]['rate'])])
          tableData.push(data[k])
        }
        this.tableData = tableData
        ret.series.push(lineObj)
        this.drawLine(ret)
      },
      download () {}
    },
    components: {
      constant, datePicker, vButton, vTitle, vRadio
    }
  }
</script>
