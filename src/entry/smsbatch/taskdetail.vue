<template>
  <div class="taskdetail-wrap">
    <div class="search-box">

      <div class="record-list">
        <!--<div class="table-operations">
          <span class="download"><i class="iconfont icon-download"></i>导出数据</span>
        </div>-->
        <v-title text="任务明细"></v-title>
        <el-table
                v-loading="isLoading"
                :data="tableData"
                stripe
                style="width: 100%">

          <el-table-column v-for="(column, idx) in columns" :key="idx"
                           :prop="column.key"
                           :label="column.title"
                           :width="column.width"
                           :formatter="column.formatter"
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
  .taskdetail-wrap
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
        columns: [
          {key: 'send_time', title: '发送时间', width: '180px', formatter: (row, column) => { return moment(new Date(parseInt(row[column['property']] + '000'))).format(dateFormat) }},
          {key: 'send_message', title: '内容', width: '200px', formatter: (row, column) => { return decodeURIComponent(row[column['property']]) }},
          {key: 'fee_count', title: '计费条数'},
          {key: 'phone', title: '手机号'},
          {key: 'result_type_text', title: '接收状态'}
        ],
        tableData: []
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.tabs.forEach((v, i) => {
          if (v['name'] == 'new') {
            v['show'] = false
          } else {
            v['show'] = true
          }
        })
        vm.getList()
      })
    },
    props: {
      tabs: Array
    },
    watch: {
      currentPage () {
        this.getList()
      }
    },
    created () {
      // this.getList()
    },
    methods: {
      getList () {
        let params = {}
        params['page'] = this.currentPage
        params['task_id'] = this.$route.query.id

        this.request(Services.messageRecordDetail, params, (remoteData) => {
          this.tableData = remoteData.data
          // this.pageSize = remoteData.page_size
          this.total = parseInt(remoteData.total)
        })
      }
    },
    components: {
      constant, datePicker, vSelect, vButton, vTitle, vInput
    }
  }
</script>
