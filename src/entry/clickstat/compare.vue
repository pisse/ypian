<template>
  <div class="sendrecord-wrap">
    <div class="search-box">
      <!--<constant :opt="account"></constant>
      <br/>-->
      <v-radio :formData="formData" :opt="types"></v-radio>
      <br/>
      <!--<date-picker :formData="formData" type="date" :opt="dataRange" dateFormat="yyyy-MM-dd"> </date-picker>
      <br/>-->

      <v-button text="查询" @search="search"></v-button>
      <v-title text="营销对比"></v-title>

      <div class="record-list">
        <!-- <div class="table-operations">
           <span class="download"><i class="iconfont icon-download"></i>导出数据</span>
         </div>-->

       <!-- <el-row :gutter="20" class="table-header">
          <el-col :span="2" :offset="20">&nbsp;&lt;!&ndash;<el-button size="small"><i class="iconfont icon-download"></i>下载</el-button>&ndash;&gt;</el-col>
          <el-col :span="2" ><el-button icon="plus" type="primary" size="small" :disabled="isCompare" @click="compare">对比</el-button></el-col>
        </el-row>
-->
        <div class="highcharts-container" >
          <div id="chartWrap" ref="chartDiv"></div>
        </div>

      </div>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
  .sendrecord-wrap
    .record-list
      .table-operations
        text-align : right
        height: 40px
        line-height : 40px
        .download
          margin: 0 20px
          cursor : pointer
      .block
        margin : 10px 0
</style>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  // import { Alert, Loading, Table, TableColumn, Pagination, Button, Row, Col } from 'element-ui'
  import constant from 'components/filters/constant'
  import datePicker from 'components/filters/datePicker'
  import vSelect from 'components/filters/vSelect'
  import vButton from 'components/filters/vButton'
  import vInput from 'components/filters/vInput'
  import vTitle from 'components/filters/vTitle'
  import vRadio from 'components/filters/vRadio'
  import moment from 'moment'
  import _base from '../mixin/request.js'
  import _statistic from '../mixin/statistic.js'

  // Vue.use(Loading.directive)
  import Services from 'common/js/services.js'

  const dateFormat = 'YYYY-MM-DD'
  export default {
    mixins: [_base, _statistic],
    data () {
      return {
        account: {name: '账户名', value: ''},
        dataRange: {
          name: '起止时间',
          keyStart: 'start_time',
          keyEnd: 'end_time',
          desc: '可查询三个月内记录'
        },
        types: {
          name: '统计时间',
          key: 'type',
          items: [{label: '36小时', val: '1'}, {label: '72小时', val: 2}]
        },
        formData: {
          type: '1'
          // start_time: moment().hour(0).minute(0).second(0).format(dateFormat), // .subtract(2, 'days')
          // end_time: moment().hour(23).minute(59).second(59).format(dateFormat)
        }
      }
    },
    props: {
      tabs: Array,
      userInfo: Object
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.tabs.forEach((v, i) => {
          if (v['name'] == 'compare' || v['name'] == 'stat') {
            v['show'] = true
          } else {
            v['show'] = false
          }
        })
      })
    },
    watch: {
      userInfo (newVal) {
        this.account.value = newVal['username']
        // this.formData.user_id = newVal['user_id']
      }
    },
    created () {
      this.account.value = this.userInfo['username']
      this.setWatch()
      this.search()
    },
    methods: {
      setWatch () {
        this.$watch('formData.type', (v, o) => {
          if (v != o) {
            this.search()
          }
        })
      },
      search () {
        let params = Object.assign({}, this.formData)
        params['page'] = this.currentPage
        // params['start_time'] = moment(params['start_time']).format(dateFormat)
        // params['end_time'] = moment(params['end_time']).format(dateFormat)
        params['activity_id'] = this.$route.query.id

        this.request(Services.clickStatDetailNew, params, (remoteData) => {
          // this.tableData = remoteData.data
          // this.pageSize = remoteData.page_size
          this.format(remoteData)
          // this.total = this.tableData.length
        })
      },
      format (data) {
        let ret = {
          ele: 'chartWrap',
          type: 'spline',
          title: '',
          categories: [],
          series: [],
          height: 500,
          yFormat: '{value}%',
          tickInterval: 3,
          minTickInterval: 1,
          tooltipSuffix: '%'
        }
        let isFirst = true
        let showData = data.show_data
        let activityData = data.activity_data
        for (var id in showData) {
          let temp = showData[id]
          let lineObj = {
            name: activityData[id]['title'] || id,
            data: []
          }
          for (var key in temp) {
            if (isFirst) {
              ret['categories'].push(key)
              // lineObj['name'] = temp[key]['title']
            }
            lineObj['data'].push(parseFloat(temp[key]))
          }
          isFirst = false
          ret.series.push(lineObj)
        }

        this.drawLine(ret)
      }
    },
    components: {
      constant, datePicker, vSelect, vButton, vTitle, vInput, vRadio
    }
  }
</script>
