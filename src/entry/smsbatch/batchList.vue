<template>
  <div class="batch-list">
    <el-alert
            title="添加手机号,编写短信内容即可群发短信,无需技术开发"
            type="info">
    </el-alert>
    <div class="new-btn">
      <el-button @click="goNew" type="primary" icon="plus">新建群发计划</el-button>
    </div>
    <v-title text="群发列表"></v-title>

    <constant :opt="account"></constant>
    <br/>
    <date-picker :formData="formData" :opt="dataRange"></date-picker>
    <v-select :formData="formData" ref="status" :opt="status"></v-select>
    <v-button text="查询"></v-button>

    <el-table
            class="list-table"
            v-loading="isLoading"
            :data="tableData"
            stripe
            style="width: 100%">
      <el-table-column
              prop="apply_time"
              label="申请时间">
      </el-table-column>
      <el-table-column
              prop="send_time"
              label="发送时间">
      </el-table-column>
      <el-table-column
              prop="sub_account"
              label="子账号">
      </el-table-column>
      <el-table-column
              prop="content"
              label="短信内容">
      </el-table-column>
      <el-table-column
              prop="status"
              label="状态">
      </el-table-column>
      <el-table-column
              prop="num"
              width="200px"
              label="提交号码数/消耗条数">
      </el-table-column>
      <el-table-column
              label="操作">
        <template scope="scope">
          <el-button size="small" >发送短信</el-button>
        </template>
      </el-table-column>
    </el-table>

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
  import { Alert, Table, Loading, TableColumn, MessageBox, Message, Pagination, Button } from 'element-ui'
  import vTitle from 'components/filters/vTitle'
  import vInput from 'components/filters/vInput'
  import constant from 'components/filters/constant'
  import datePicker from 'components/filters/datePicker'
  import vSelect from 'components/filters/vSelect'
  import vButton from 'components/filters/vButton'
  import moment from 'moment'

  Vue.use(Loading.directive)
  Vue.prototype.$confirm = MessageBox.confirm
  import Services from 'common/js/services.js'

  const dateFormat = 'YYYY-MM-DD H:mm:ss'

  export default {
    data () {
      return {
        isLoading: false,
        tableData: [],
        account: {name: '账户名', value: 'changdlerHuang'},
        dataRange: {
          name: '起止时间',
          keyStart: 'start_date',
          keyEnd: 'end_date',
          desc: ''
        },
        status: {
          name: '状态',
          key: 'status',
          value: 'all',
          items: [{label: '全部', val: 'all'}, {label: '未开始', val: 'no-start'}, {label: '进行中', val: 'starting'}, {label: '已完成', val: 'finished'}, {label: '已取消', val: 'canceled'}, {label: '审核未通过', val: 'check-failed'}, {label: '等待审核', val: 'check-waiting'}]
        },
        formData: {
          status: 'all',
          phone: '',
          start_date: moment().subtract(2, 'days').hour(0).minute(0).second(0).format(dateFormat),
          end_date: moment().hour(23).minute(59).second(59).format(dateFormat)
        }
      }
    },
    methods: {
      goNew () {
        this.$router.push({name: 'new'})
      }
    },
    components: {
      elAlert: Alert, MessageBox, Message, vTitle, elTable: Table, elTableColumn: TableColumn, elPagination: Pagination, vSelect, datePicker, constant, vInput, elButton: Button, vButton
    }
  }
</script>
