<template>
  <div class="sendrecord-wrap">
    <div class="search-box">
      <constant :opt="account"></constant>
      <br/>
      <date-picker :formData="formData" :opt="dataRange"></date-picker>
      <v-input :formData="formData" :opt="mobile"></v-input>
      <br/>
      <v-select :formData="formData" ref="status" :opt="status"></v-select>
      <br>
      <v-button text="查询" @search="search"></v-button>
      <v-title text="发送记录"></v-title>

      <div class="record-list">
        <div class="table-operations">
          <span class="download"><i class="iconfont icon-download"></i>导出数据</span>
        </div>
        <el-table
                v-loading="isloading"
                :data="tableData"
                stripe
                style="width: 100%">
          <el-table-column
                  prop="date"
                  label="日期"
                  width="180">
          </el-table-column>
          <el-table-column
                  prop="name"
                  label="姓名"
                  width="180">
          </el-table-column>
          <el-table-column
                  prop="address"
                  label="地址">
          </el-table-column>
        </el-table>

        <div class="block">
          <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage4"
                  :page-sizes="[100, 200, 300, 400]"
                  :page-size="100"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="400">
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
  import { Alert, DatePicker, Loading, Table, TableColumn, Pagination } from 'element-ui'
  import constant from 'components/filters/constant'
  import datePicker from 'components/filters/datePicker'
  import vSelect from 'components/filters/vSelect'
  import vButton from 'components/filters/vButton'
  import vInput from 'components/filters/vInput'
  import vTitle from 'components/filters/vTitle'
  import moment from 'moment'

  Vue.use(Loading.directive)

  const dateFormat = 'YYYY-MM-DD HH:mm:ss'
  export default {
    data () {
      return {
        isloading: false,
        multipleSelection: [],
        tableData: [{
          date: '13811579372',
          name: '王小虎',
          address: '默认组'
        }, {
          date: '13811579372',
          name: '王小虎',
          address: '默认组'
        }, {
          date: '13811579372',
          name: '王小虎',
          address: '默认组'
        }, {
          date: '13811579372',
          name: '王小虎',
          address: '默认组'
        }, {
          date: '13811579372',
          name: '王小虎',
          address: '默认组'
        }],
        account: {name: '账户名', value: 'changdlerHuang'},
        dataRange: {
          name: '起止时间',
          keyStart: 'start_date',
          keyEnd: 'end_date',
          desc: '可查询三个月内记录'
        },
        status: {
          name: '接受状态',
          key: 'status',
          value: 'all',
          items: [{label: '全部', val: 'all'}, {label: '接受成功', val: 'success'}, {label: '接受失败', val: 'fail'}, {label: '等待返回', val: 'waiting'}]
        },
        mobile: {
          name: '手机号',
          key: 'phone',
          placeHolder: '请填写正确的手机号',
          rules: [{ phone: true, message: '请填写正确11位手机号', trigger: 'blur' }]
        },
        currentPage4: 2,
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
    methods: {
      search () {
        this.formData['start_date'] = moment(this.formData['start_date']).format(dateFormat)
        console.log(this.formData)
      },
      handleSizeChange () {},
      handleCurrentChange () {},
      handleSelectionChange (val) {
        this.multipleSelection = val
      }
    },
    components: {
      elAlert: Alert, elTable: Table, elTableColumn: TableColumn, Loading, elPagination: Pagination, elDatePicker: DatePicker, constant, datePicker, vSelect, vButton, vTitle, vInput
    }
  }
</script>
