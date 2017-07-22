<template>
  <div class="sendrecord-wrap">
    <div class="search-box">
      <constant :opt="account"></constant>
      <br/>
      <date-picker :formData="formData" :opt="dataRange" type="datetime" dateFormat="yyyy-MM-dd HH:mm:ss"></date-picker>
     <!-- <v-input :formData="formData" :opt="mobile"></v-input>-->
      <br/>
      <v-select :formData="formData" ref="status" :opt="status"></v-select>
      <br>
      <v-button text="查询" @search="getList"></v-button>
      <v-title text="发送记录"></v-title>

      <div class="record-list">
        <!--<div class="table-operations">
          <span class="download"><i class="iconfont icon-download"></i>导出数据</span>
        </div>-->
        <el-table
                v-loading="isLoading"
                :data="tableData"
                stripe
                style="width: 100%">

          <el-table-column v-for="(column, idx) in columns" :key="idx"
                           :prop="column.key"
                           :label="column.title"
                           :width="column.width"
          ></el-table-column>

        </el-table>

        <div class="block">
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
  // import { Alert, DatePicker, Loading, Table, TableColumn, Pagination } from 'element-ui'
  import constant from 'components/filters/constant'
  import datePicker from 'components/filters/datePicker'
  import vSelect from 'components/filters/vSelect'
  import vButton from 'components/filters/vButton'
  import vInput from 'components/filters/vInput'
  import vTitle from 'components/filters/vTitle'
  import moment from 'moment'

  import Services from 'common/js/services.js'
  import _request from '../mixin/request'
  import _pagination from '../mixin/pagination'
  // Vue.use(Loading.directive)

  const dateFormat = 'YYYY-MM-DD HH:mm:ss'
  // const dateFormat = 'YYYY-MM-DD'
  export default {
    mixins: [_request, _pagination],
    data () {
      return {
        multipleSelection: [],
        columns: [
          {key: 'op_submit_time', title: '发送时间', width: '180px'},
          {key: 'msg_content', title: '内容', width: '200px'},
          {key: 'ap_fee_count', title: '计费条数'},
          {key: 'mobile', title: '手机号'},
          {key: 'status_text', title: '接收状态'}
        ],
        tableData: [],
        account: {name: '账户名', value: ''},
        dataRange: {
          name: '起止时间',
          keyStart: 'start_time',
          keyEnd: 'end_time',
          desc: '可查询三个月内记录'
        },
        status: {
          name: '发送状态',
          key: 'status',
          value: '',
          items: [
            /* {label: '全部', val: ''},
            {label: '发送失败', val: '-3'},
            {label: '任务生成失败', val: '-2'},
            {label: '不通过', val: '-1'},
            {label: '待审核', val: '0'},
            {label: '通过', val: '1'},
            {label: '任务生成中', val: '2'},
            {label: '发送中', val: '3'},
            {label: '发送成功', val: '4'},
            {label: '部分发送成功', val: '5'} */
            {label: '全部 ', val: '0'},
            {label: '未知 ', val: '2'},
            {label: '成功 ', val: '4'},
            {label: '失败', val: '5'}
          ]
        },
        mobile: {
          name: '手机号',
          key: 'phone',
          placeHolder: '请填写正确的手机号',
          rules: [{ phone: true, message: '请填写正确11位手机号', trigger: 'blur' }]
        },
        formData: {
          status: '',
          // phone: '',
          start_time: moment().subtract(0, 'days').hour(0).minute(0).second(0).format(dateFormat),
          end_time: moment().format(dateFormat)
        }
      }
    },
    props: {
      routes: Array,
      userInfo: Object
    },
    watch: {
      currentPage () {
        this.getList()
      },
      userInfo (newVal) {
        this.account.value = newVal['username']
        // this.formData.user_id = newVal['user_id']
      }
    },
    created () {
      this.getList()
      this.account.value = this.userInfo['username']
    },
    methods: {
      getList () {
        let params = Object.assign({}, this.formData)
        params['page'] = this.currentPage
        params['start_time'] = moment(params['start_time']).format(dateFormat)
        params['end_time'] = moment(params['end_time']).format(dateFormat)

        this.request(Services.messageRecord, params, (remoteData) => {
          this.tableData = remoteData.data.list
          // this.pageSize = remoteData.page_size
          this.total = parseInt(remoteData.data.total)
        })
      }
    },
    components: {
      constant, datePicker, vSelect, vButton, vTitle, vInput
    }
  }
</script>
