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
      <v-button text="查询" :loading="isloading" @search="search"></v-button>
      <v-title text="短信到达率概览"></v-title>

      <div class="charts-wrap">
        <div id="line"></div>
      </div>

      <div class="table-wrap" v-if="formData.statistic_type == 'history'">
        <v-title text="短信到达率"></v-title>
        <div class="table-operations">
          <span class="download" @click="download"><i class="iconfont icon-download"></i>导出数据</span>
        </div>
        <el-table
                :data="tableData"
                stripe
                style="width: 100%">
          <el-table-column
                  prop="date"
                  label="日期"
          >
          </el-table-column>
          <el-table-column
                  prop="recv_success_total_rate"
                  label="短信接收成功率">
          </el-table-column>
          <el-table-column
                  prop="recv_fail_total_rate"
                  label="短信接收失败率	">
          </el-table-column>
          <el-table-column
                  prop="recv_no_total_rate"
                  label="短信接收未知率">
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
  import { Alert, DatePicker, Loading, Table, TableColumn, Pagination, MessageBox } from 'element-ui'
  import constant from 'components/filters/constant'
  import datePicker from 'components/filters/datePicker'
  import vButton from 'components/filters/vButton'
  import vTitle from 'components/filters/vTitle'
  import vRadio from 'components/filters/vRadio'

  import moment from 'moment'

  import statisticMixin from '../mixin/statistic'
  import Services from 'common/js/services.js'
  Vue.use(Loading.directive)
  Vue.prototype.$alert = MessageBox.alert

  Vue.use(Loading.directive)

  const dateFormat = 'YYYY-MM-DD'
  export default {
    mixins: [statisticMixin],
    data () {
      return {
        userInfo: {},
        isloading: false,
        account: {name: '账户名', value: 'changdlerHuang'},
        types: {
          name: '接受状态',
          key: 'statistic_type',
          items: [{label: '实时统计（今日）', val: 'realtime'}, {label: '历史统计', val: 'history'}]
        },
        dataRange: {
          name: '起止时间',
          keyStart: 'start_date',
          keyEnd: 'end_date',
          desc: '可查询三个月内记录'
        },
        formData: {
          statistic_type: 'realtime',
          start_date: moment().subtract(7, 'days').format(dateFormat),
          end_date: moment().subtract(1, 'days').format(dateFormat)
        },
        tableData: []
      }
    },
    watch: {
      formData: {
        handler: function (val, oldVal) {
          this.search()
        },
        deep: true
      }
    },
    created () {
      this.getUserInfo()
      this.search()
    },
    methods: {
      getUserInfo () {
        this.$http.jsonp(Services.messageSignInfo, {
        }).then((res) => {
          res = res.json()
          return res
        }).then((remoteData) => {
          this.userInfo = remoteData.user_info || {}
          this.account.value = this.userInfo.username
        })
      },
      search () {
        this.isloading = true
        let url = this.formData.statistic_type == 'realtime' ? Services.dataRealtimeArrive : Services.dataHistoryeArrive
        this.$http.jsonp(url, {
          params: this.formData
        }).then((res) => {
          res = res.json()
          return res
        }).then((remoteData) => {
          this.isloading = false
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
          this.formatHistory(data)
        }
      },
      formatRealtime (data) {
        let ret = {
          ele: 'line',
          categories: [],
          series: [],
          yFormat: '{value}%',
          max: 100
        }
        let lineObj = {
          name: '实时到达率',
          data: []
        }
        for (var k in data) {
          ret['categories'].push(k)
          lineObj['data'].push(parseFloat(data[k]['rate']))
        }
        ret.series.push(lineObj)
        console.log(lineObj)
        this.drawLine(ret)
      },
      download () {},
      formatHistory (data) {
        let ret = {
          ele: 'line',
          title: '',
          categories: [],
          series: [],
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
        let tableData = []
        for (var k in data.list) {
          ret['categories'].push(k)
          for (var key in seriesOpt) {
            seriesOpt[key]['data'].push(data.list[k][key])
          }
          data['list'][k]['date'] = k
          tableData.push(data['list'][k])
        }
        for (var t in seriesOpt) {
          ret.series.push(seriesOpt[t])
        }
        ret.title = this.formData['start_date'] + '-' + this.formData['end_date'] + ',' +
                '总计短信接收成功率' + data['recv_success_rate'] + ',短信接收失败率' + data['recv_fail_rate'] + ',短信接收未知率 ' + data['recv_no_rate']
        this.tableData = tableData
        this.drawLine(ret)
      }
    },
    components: {
      elAlert: Alert, elTable: Table, elTableColumn: TableColumn, Loading, elPagination: Pagination, elDatePicker: DatePicker, constant, datePicker, vButton, vTitle, vRadio, MessageBox
    }
  }
</script>
