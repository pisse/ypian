<template>
  <div class="statistic-send">
    <div class="search-box">
      <v-radio :formData="formData" :opt="types"></v-radio>
      <br/>
      <template  v-if="formData.statistic_type == 'history'">
        <date-picker :formData="formData"  type="date" :opt="dataRange" dateFormat="yyyy-MM-dd"></date-picker>
        <br>
      </template>

      <!--<constant :formData="formData" :opt="category" @select="selectCate"></constant>-->
      <br/>
      <v-button text="查询" :loading="isLoading" @search="search"></v-button>
      <v-title text="短信耗时概览"></v-title>

      <div class="charts-wrap">
        <div id="chart"></div>
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
  import constant from 'components/filters/constantMulti'
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
        category: {label: '账户名', key: 'category', items: [{name: '全部(含验证码、通知、营销)', value: 'all'}, {name: '仅验证码', value: 'code'}]},
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
          category: 'all',
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
      // this.account.value = this.userInfo['username']
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
      selectCate (val) {
        this.formData['category'] = val
      },
      search () {
        let url = this.formData.statistic_type == 'realtime' ? Services.dataRealtimeDelay : Services.dataHistoryeDelay
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
        this.formatRealtime(data)
      },
      formatRealtime (data) {
        let ret = {
          ele: 'chart',
          categories: [],
          series: [],
          type: 'column', // waterfall
          max: 100,
          yFormat: '{value}%'
        }
        let lineObj = {
          name: '耗时区间占比',
          data: [],
          tooltip: {
            valueSuffix: '%'
          },
          dataLabels: {
            enabled: true,
            formatter: function () {
              return this.y + '%'
            },
            style: {
              color: '#FFFFFF',
              fontWeight: 'bold',
              textShadow: '0px 0px 3px black'
            }
          }
        }
        for (var k in data) {
          ret['categories'].push(k)
          lineObj['data'].push({
            name: k,
            y: parseFloat(data[k]['rate'])
          })
        }
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
