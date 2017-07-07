<template>
  <div class="sendrecord-wrap">
    <div class="search-box">
      <v-radio :formData="formData" :opt="types"></v-radio>
      <br/>
      <date-picker :formData="formData" type="datetime" :opt="dataRange" dateFormat="yyyy-MM-dd HH:mm:ss"> </date-picker>
      <br/>

      <v-button text="查询" @search="getList"></v-button>
      <v-title text="累计点击量"></v-title>

      <div class="charts-wrap">
        <div id="line" ref="chartDiv"></div>
      </div>

      <v-title text="点击量"></v-title>
      <div class="record-list">
        <!-- <div class="table-operations">
           <span class="download"><i class="iconfont icon-download"></i>导出数据</span>
         </div>-->

        <el-table
                v-loading="isLoading"
                :data="tableData"
                stripe
                style="width: 100%">

          <el-table-column v-for="(column, idx) in columns" :key="idx"
                           :fixed="column.fixed"
                           :prop="column.key"
                           :label="column.title"
                           :width="column.width"
          ></el-table-column>


        </el-table>

        <div class="mt15">
          <!--<el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="total">
          </el-pagination>-->
        </div>

      </div>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
  .sendrecord-wrap
    .charts-wrap
      margin-top : 25px
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
  import Services from 'common/js/services.js'
  import _base from '../mixin/request.js'
  import _pagination from '../mixin/pagination.js'
  import statisticMixin from '../mixin/statistic'

  // Vue.use(Loading.directive)

  const dateFormat = 'YYYY-MM-DD HH:mm:ss'
  export default {
    mixins: [_base, _pagination, statisticMixin],
    data () {
      return {
        multipleSelection: [],
        types: {
          name: '统计时间',
          key: 'type',
          items: [{label: '按天', val: '2'}, {label: '按时', val: '1'}]
        },
        tableData: [],
        columns: [{key: 'date', title: '生成时间', fixed: true, width: '180px'}, {key: 'title', title: '活动名称'}, {key: 'activity_id', title: '活动ID'},
          {key: 'short_url', title: '统计链接', width: '180px'},
          {key: 'click_total', title: '点击量'}, {key: 'click_apr', title: '点击率'}
        ],
        dataRange: {
          name: '起止时间',
          keyStart: 'start_time',
          keyEnd: 'end_time',
          desc: '可查询三个月内记录'
        },
        formData: {
          activity_id: '',
          type: '1',
          start_time: moment().hour(0).minute(0).second(0).format(dateFormat), // subtract(1, 'days').
          end_time: moment().format(dateFormat)
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        let start_time = vm.$route.query.start_time
        vm.formData.start_time = start_time

        vm.getList()
        vm.tabs.forEach((v, i) => {
          if (v['name'] == 'detail' || v['name'] == 'stat') {
            v['show'] = true
          } else {
            v['show'] = false
          }
        })
      })
    },

    props: {
      tabs: Array,
      userInfo: Object
    },
    created () {
      this.setWatch()
    },
    methods: {
      setWatch () {
        this.$watch('formData.type', (v, o) => {
          if (v != o) {
            this.getList()
          }
        })
      },
      getList () {
        let params = Object.assign({}, this.formData)
        params['page'] = this.currentPage
        params['start_time'] = moment(params['start_time']).format(dateFormat)
        params['end_time'] = moment(params['end_time']).format(dateFormat)
        params['activity_id'] = this.$route.query.id

        this.request(Services.clickStatDetail, params, (remoteData) => {
          // this.tableData = remoteData.data
          // this.pageSize = remoteData.page_size
          this.drawChart(remoteData.data)
          this.tableData = this.formatData(remoteData.data)
          this.total = this.tableData.length
        })
      },
      drawChart (data) {
        if (!data || data.length == 0) {
          this.$refs.chartDiv.innerHTML = '<div class="empty"> 暂无数据</div>'
          return
        }
        let ret = {
          ele: 'line',
          type: 'spline',
          title: '',
          categories: [],
          series: [],
          height: 500,
          yFormat: '{value}条',
          tickInterval: 6,
          minTickInterval: 1
        }

        for (var id in data) {
          let temp = data[id]
          let lineObj = {
            name: '活动ID(' + id + ')',
            data: []
          }
          let isFirst = true
          for (var key in temp) {
            ret['categories'].push(key)
            lineObj['data'].push(temp[key]['click_total'])
            if (isFirst && temp[key]['title']) {
              lineObj['name'] = temp[key]['title']
              isFirst = false
            }
          }
          ret.series.push(lineObj)
        }
        this.drawLine(ret)
      },
      formatData (data) {
        let ret = []
        let rData = data[this.$route.query.id]
        for (var k in rData) {
          rData[k]['date'] = k
          ret.push(rData[k])
        }
        return ret.reverse()
      }
    },
    components: {
      constant, datePicker, vSelect, vButton, vTitle, vInput, vRadio
    }
  }
</script>
