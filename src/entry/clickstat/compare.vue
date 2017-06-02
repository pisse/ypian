<template>
  <div class="sendrecord-wrap">
    <div class="search-box">
      <constant :opt="account"></constant>
      <br/>
      <date-picker :formData="formData" type="date" :opt="dataRange" dateFormat="yyyy-MM-dd"> </date-picker>
      <br/>

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
          <div id="chartWrap"></div>
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
  import { Alert, Loading, Table, TableColumn, Pagination, Button, Row, Col } from 'element-ui'
  import constant from 'components/filters/constant'
  import datePicker from 'components/filters/datePicker'
  import vSelect from 'components/filters/vSelect'
  import vButton from 'components/filters/vButton'
  import vInput from 'components/filters/vInput'
  import vTitle from 'components/filters/vTitle'
  import moment from 'moment'
  import _base from '../mixin/request.js'
  import _statistic from '../mixin/statistic.js'
  import _pagination from '../mixin/pagination.js'

  Vue.use(Loading.directive)

  const dateFormat = 'YYYY-MM-DD HH:mm:ss'
  export default {
    mixins: [_base, _statistic, _pagination],
    data () {
      return {
        isloading: false,
        account: {name: '账户名', value: 'changdlerHuang'},
        dataRange: {
          name: '起止时间',
          keyStart: 'start_date',
          keyEnd: 'end_date',
          desc: '可查询三个月内记录'
        },
        mobile: {
          name: '手机号',
          key: 'phone',
          placeHolder: '请填写正确的手机号',
          rules: [{ phone: true, message: '请填写正确11位手机号', trigger: 'blur' }]
        },
        formData: {
          status: 'all',
          phone: '',
          start_date: moment().subtract(2, 'days').hour(0).minute(0).second(0).format(dateFormat),
          end_date: moment().hour(23).minute(59).second(59).format(dateFormat)
        }
      }
    },
    props: {
      routes: Array
    },
    created () {
      this.$nextTick(() => {
        this.format([])
      })
    },
    methods: {
      search () {
        this.formData['start_date'] = moment(this.formData['start_date']).format(dateFormat)
      },
      format (data) {
        let ret = {
          ele: 'chartWrap',
          title: '',
          categories: [],
          series: [],
          height: 400,
          yFormat: '{value}条'
        }
        let lineObj = {
          name: '总数',
          data: []
        }
        let lineObjSuccess = {
          name: '成功数',
          data: []
        }
        for (var i = 0; i < data.length; i++) {
          let temp = data[i]
          for (var key in temp['data']) {
            ret['categories'].push(key)
            lineObj['data'].push(temp['data'][key]['record_total'])
            lineObjSuccess['data'].push(temp['data'][key]['success_total'])
          }
        }
        ret.series.push(lineObj)
        ret.series.push(lineObjSuccess)
        console.log(ret)

        this.drawLine(ret)
      }
    },
    components: {
      elAlert: Alert, elTable: Table, elTableColumn: TableColumn, Loading, elPagination: Pagination, constant, datePicker, vSelect, vButton, vTitle, vInput, elButton: Button, elRow: Row, elCol: Col
    }
  }
</script>
