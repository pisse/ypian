<template>
  <div class="batch-list">
    <!--<el-alert
            title="添加手机号,编写短信内容即可群发短信,无需技术开发"
            type="info">
    </el-alert>-->
    <div class="new-btn">
      <el-button @click="goNew" type="primary" icon="plus">新建群发计划</el-button>
    </div>
    <v-title text="群发列表"></v-title>

    <constant :opt="account"></constant>
    <br/>
    <date-picker :formData="formData" :opt="dataRange" type="datetime" dateFormat="yyyy-MM-dd HH:mm:ss"></date-picker>
    <v-select :formData="formData" ref="status" :opt="status"></v-select>
    <v-button text="查询" @search="getList"></v-button>

    <el-table
            class="list-table"
            v-loading="isLoading"
            :data="tableData"
            stripe
            style="width: 100%">

      <el-table-column v-for="(column, idx) in columns" :key="idx"
                       :col="column"
                       :prop="column.key"
                       :label="column.title"
                       :width="column.width"
      >
        <template scope="scope">
          <span v-if="scope.column.property !='total_message'">{{scope.row[scope.column.property]}}</span>
          <div v-else>
            {{scope.row['phone_count']}}/{{parseInt(scope.row['phone_count']) * parseInt(scope.row['message_count'])}}
            <el-button @click.prevent="messageDetail(scope.$index, scope.row)"  type="text" size="small" >详细</el-button>
          </div>
        </template>

      </el-table-column>

      <el-table-column
              label="操作">
        <template scope="scope">
          <el-button size="small" @click="clickDetail(scope.$index, scope.row)" v-if="scope.row.status == '4' && scope.row.activity_id !='' ">发送效果</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog
            title="发送清单"
            v-model="dialogVisible"
            size="small"
            >
      <span>发送计划已生成，<br><br>{{activeDetail}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

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
</template>
<style lang="stylus" rel="stylesheet/stylus">
  .batch-list
    .new-btn
      margin-top : 20px
    .search-bar.searchBtn
      padding-left : 20px
      .el-button.el-button--primary
        padding: 7px 20px;
    .list-table
      margin-top : 10px
</style>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  // import { Alert, Table, Loading, TableColumn, MessageBox, Message, Pagination, Button } from 'element-ui'
  import vTitle from 'components/filters/vTitle'
  import vInput from 'components/filters/vInput'
  import constant from 'components/filters/constant'
  import datePicker from 'components/filters/datePicker'
  import vSelect from 'components/filters/vSelect'
  import vButton from 'components/filters/vButton'
  import moment from 'moment'

  // Vue.use(Loading.directive)
  // Vue.prototype.$confirm = MessageBox.confirm
  import Services from 'common/js/services.js'
  import _request from '../mixin/request'
  import _pagination from '../mixin/pagination'

  const dateFormat = 'YYYY-MM-DD HH:mm:ss'
  // const dateFormat = 'YYYY-MM-DD'

  export default {
    mixins: [_request, _pagination],
    data () {
      return {
        dialogVisible: false,
        activeDetail: '',
        isLoading: false,
        tableData: [],
        columns: [
          {key: 'created_at', title: '申请时间', width: '180px'}, {key: 'send_message_type', title: '发送方式'},
          {key: 'user_id', title: '用户ID'}, {key: 'send_message', title: '短信内容', width: '250px'},
          {key: 'status', title: '状态'}, {key: 'total_message', title: '提交号码数/消耗条数', template: true}
        ],
        account: {name: '账户名', value: ''},
        dataRange: {
          name: '起止时间',
          keyStart: 'start_time',
          keyEnd: 'end_time',
          desc: ''
        },
        status: {
          name: '状态',
          key: 'status',
          value: 'all',
          items: [
            {label: '全部', val: ''},
            {label: '发送失败', val: '-3'},
            {label: '任务生成失败', val: '-2'},
            {label: '不通过', val: '-1'},
            {label: '待审核', val: '0'},
            {label: '通过', val: '1'},
            {label: '任务生成中', val: '2'},
            {label: '发送中', val: '3'},
            {label: '发送成功', val: '4'},
            {label: '部分发送成功', val: '5'}
          ]
        },
        formData: {
          // user_id: '',
          status: '',
          // start_time: moment().subtract(7, 'days').format(dateFormat),
          // end_time: moment().subtract(-1, 'days').format(dateFormat)
          start_time: moment().subtract(2, 'days').hour(0).minute(0).second(0).format(dateFormat),
          end_time: moment().hour(23).minute(59).second(59).format(dateFormat)
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.tabs.forEach((v, i) => {
          if (v['name'] == 'new') {
            v['show'] = false
          }
        })
        vm.getList()
        vm.account.value = vm.userInfo['username']
      })
    },
    props: {
      userInfo: Object,
      tabs: Array
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
      console.log(this.userInfo)
      // this.getList()
    },
    methods: {
      goNew () {
        this.tabs.forEach((v, i) => {
          v['show'] = true
        })
        this.$router.push({name: 'new'})
      },
      clickDetail (idx, rowData) {
        let activity_id = rowData.activity_id
        window.location.href = 'clickstat.html#/detail?id=' + activity_id
      },
      getList () {
        let params = Object.assign({}, this.formData)
        params['page'] = this.currentPage
        params['start_time'] = moment(params['start_time']).format(dateFormat)
        params['end_time'] = moment(params['end_time']).format(dateFormat)

        this.request(Services.messageList, params, (remoteData) => {
          this.tableData = remoteData.data.list
          // this.pageSize = remoteData.page_size
          this.total = parseInt(remoteData.data.total)
        })
      },
      messageDetail (idx, rowData) {
        // console.log(111)
        this.dialogVisible = true
        let msg = '提交: ' + (rowData.phone_count || 0) +
          // '，错误号码' + (rowData.error_message || 0) +
          '，黑名单: ' + (rowData.black_count || 0) +
          '，未知错误: ' + (rowData.fail_count || 0) +
          '，发送: ' + (parseInt((rowData.phone_count || 0)) - parseInt((rowData.black_count || 0)) - parseInt((rowData.fail_count || 0))) +
          '，消耗条数: ' + (parseInt(rowData.phone_count) * parseInt(rowData.message_count) || 0)
        this.activeDetail = msg
      },
      formatter (row, column) {
        if (column['property'] === 'total_message') {
          console.log(row, column)
          return row['total_message'] + '/' + row['total_success_message']
        } else {
          return row[column['property']]
        }
      }
    },
    components: {
      vTitle, vSelect, datePicker, constant, vInput, vButton
    }
  }
</script>
