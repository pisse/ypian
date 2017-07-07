<template>
  <div class="statistic-send">
    <div class="search-box">
      <date-picker :formData="formData"  type="date" :opt="dataRange" dateFormat="yyyy-MM-dd"></date-picker>
      <br/>
      <v-button text="查询" :loading="isLoading" @search="search"></v-button>

      <div class="table-wrap">
        <v-title text="日账单"></v-title>
        <div class="table-operations">
         <!-- <span class="download" @click="download"><i class="iconfont icon-download"></i>导出数据</span>-->
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
          <!--<el-table-column
                  prop="fee"
                  label="费用"
          ></el-table-column>-->
            <el-table-column
                    prop="total"
                    label="条数"
            >
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
  import _request from '../mixin/request'
  
  import moment from 'moment'

  import Services from 'common/js/services.js'
  // Vue.use(Loading.directive)
  // Vue.prototype.$alert = MessageBox.alert

  // Vue.use(Loading.directive)

  const dateFormat = 'YYYY-MM-DD'
  export default {
    mixins: [_request],
    data () {
      return {
        userInfo: {},
        isLoading: false,
        dataRange: {
          name: '起止时间',
          keyStart: 'start_time',
          keyEnd: 'end_time',
          desc: ''
        },
        formData: {
          start_time: moment().subtract(7, 'days').format(dateFormat),
          end_time: moment().subtract(1, 'days').format(dateFormat)
        },
        tableData: []
      }
    },
    created () {
      this.search()
    },
    methods: {
      search () {
        this.isLoading = true
        let params = Object.assign({}, this.formData)
        params['start_time'] = moment(params['start_time']).format(dateFormat)
        params['end_time'] = moment(params['end_time']).format(dateFormat)
        let url = Services.dataFee
        this.request(url, params, (remoteData) => {
          this.isLoading = false
          if (remoteData.code == 0) {
            this.formatData(remoteData.data)
          }
        })
      },
      formatData (data) {
        let ret = {
          ele: 'line',
          categories: [],
          series: []
        }
        let lineObj = {
          name: '实时发送量',
          data: []
        }
        let tableData = []
        for (var k in data) {
          ret['categories'].push(k)
          lineObj['data'].push(data[k])
          data[k]['date'] = k
          tableData.push(data[k])
        }
        this.tableData = tableData
        ret.series.push(lineObj)
        // this.drawLine(ret)
      },
      download () {}
    },
    components: {
      constant, datePicker, vButton, vTitle, vRadio
    }
  }
</script>
