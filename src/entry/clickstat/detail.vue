<template>
  <div class="sendrecord-wrap">
    <div class="search-box">
      <v-radio :formData="formData" :opt="types"></v-radio>
      <br/>
      <date-picker :formData="formData" type="date" :opt="dataRange" dateFormat="yyyy-MM-dd"> </date-picker>
      <br/>

      <v-button text="查询" @search="search"></v-button>
      <v-title text="点击量概览"></v-title>

      <div class="record-list">
        <!-- <div class="table-operations">
           <span class="download"><i class="iconfont icon-download"></i>导出数据</span>
         </div>-->

        <el-table
                v-loading="isloading"
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
          <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="total">
          </el-pagination>
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
  import vRadio from 'components/filters/vRadio'

  import moment from 'moment'
  import _base from '../mixin/request.js'
  import _pagination from '../mixin/pagination.js'

  Vue.use(Loading.directive)

  const dateFormat = 'YYYY-MM-DD HH:mm:ss'
  export default {
    mixins: [_base, _pagination],
    data () {
      return {
        isloading: false,
        multipleSelection: [],
        types: {
          name: '统计时间',
          key: 'statistic_time',
          items: [{label: '按天', val: 'day'}, {label: '按时', val: 'hour'}]
        },
        tableData: [{
          date: '2017-06-17',
          name: '618预热',
          url: 'http://tmall.com',
          sms_content: '上天猫，就够了',
          send_time: '2017-05-26',
          click_num: '1000',
          click_rate: '9.11%'
        }, {
          date: '2017-06-17',
          name: '618预热',
          url: 'http://tmall.com',
          sms_content: '上天猫，就够了',
          send_time: '2017-05-26',
          click_num: '1000',
          click_rate: '9.11%'
        }],
        columns: [{key: 'date', title: '生成时间', fixed: true}, {key: 'name', title: '活动名称'},
          {key: 'url', title: '统计链接'}, {key: 'sms_content', title: '发送短信'}, {key: 'send_time', title: '发送时间'},
          {key: 'click_num', title: '点击量'}, {key: 'click_rate', title: '点击率'}
        ],
        dataRange: {
          name: '起止时间',
          keyStart: 'start_date',
          keyEnd: 'end_date',
          desc: '可查询三个月内记录'
        },
        formData: {
          statistic_time: 'day',
          start_date: moment().subtract(2, 'days').hour(0).minute(0).second(0).format(dateFormat),
          end_date: moment().hour(23).minute(59).second(59).format(dateFormat)
        }
      }
    },
    props: {
      routes: Array
    },
    methods: {
      search () {
        this.formData['start_date'] = moment(this.formData['start_date']).format(dateFormat)
      }
    },
    components: {
      vRadio, elAlert: Alert, elTable: Table, elTableColumn: TableColumn, Loading, elPagination: Pagination, constant, datePicker, vSelect, vButton, vTitle, vInput, elButton: Button, elRow: Row, elCol: Col
    }
  }
</script>
