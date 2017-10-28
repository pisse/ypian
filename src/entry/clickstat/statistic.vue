<template>
  <div class="sendrecord-wrap">
    <div class="search-box">
      <constant :opt="account"></constant>
      <br/>
      <date-picker :formData="formData" type="datetime" :opt="dataRange" dateFormat="yyyy-MM-dd HH:mm:ss"> </date-picker>
      <br/>
       <v-input :formData="formData" :opt="title"></v-input>
        <br/>
      <v-button text="查询" @search="getList"></v-button>
      <v-title text="短链点击统计"></v-title>

      <div class="record-list">
       <!-- <div class="table-operations">
          <span class="download"><i class="iconfont icon-download"></i>导出数据</span>
        </div>-->

        <el-row :gutter="20" class="table-header">
          <!--<el-col :span="2" :offset="20">&nbsp;&lt;!&ndash;<el-button size="small"><i class="iconfont icon-download"></i>下载</el-button>&ndash;&gt;</el-col>-->
          <el-col><el-button class="mr20" icon="plus" type="primary" size="small" :disabled="isCompare" @click="compare">对比</el-button>(选择两次活动，进行对比分析，可查看活动效果差异)</el-col>
        </el-row>

        <el-table
                v-loading="isLoading"
                @selection-change="handleSelectionChange"
                :data="tableData"
                stripe
                style="width: 100%">

          <el-table-column
                  type="selection"
                  width="55">
          </el-table-column>
          <el-table-column v-for="(column, idx) in columns" :key="idx"
                           :fixed="column.fixed"
                           :prop="column.key"
                           :label="column.title"
                           :width="column.width"
          ></el-table-column>

          <el-table-column
              label="操作"
              width="80px">
            <template scope="scope">
              <!--<el-button @click="onDetail" type="text" size="small">查看</el-button>-->
              <el-button @click.prevent="onDevice(scope.$index, scope.row)" type="text" size="small">设备统计</el-button>
              <el-button @click.prevent="onDetail(scope.$index, scope.row)" type="text" size="small">查看</el-button>
              <!--<el-button @click.prevent="onDelete" type="text" size="small">删除</el-button>-->
            </template>
        </el-table-column>

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
  import moment from 'moment'

  import Services from 'common/js/services.js'
  import _request from '../mixin/request'
  import _pagination from '../mixin/pagination'

  Vue.use(Loading.directive)

  const dateFormat = 'YYYY-MM-DD HH:mm:ss'
  export default {
    mixins: [_request, _pagination],
    data () {
      return {
        multipleSelection: [],
        tableData: [],
        columns: [{key: 'created_at', title: '生成时间'}, {key: 'title', title: '活动名称'},
          {key: 'short_url', title: '统计链接'}, {key: 'total_message', title: '发送短信'}, {key: 'send_time', title: '发送时间'},
          {key: 'click_total', title: '点击量'}, {key: 'click_apr', title: '点击率'}
        ],
        account: {name: '账户名', value: ''},
        dataRange: {
          name: '起止时间',
          keyStart: 'start_time',
          keyEnd: 'end_time',
          desc: '可查询三个月内记录'
        },
        title: {
          name: '活动标题',
          key: 'title',
          placeHolder: '请填写活动标题'
        },
        formData: {
          title: '',
          start_time: moment().subtract(2, 'days').hour(0).minute(0).second(0).format(dateFormat),
          end_time: moment().hour(23).minute(59).second(59).format(dateFormat)
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
          if (v['name'] != 'stat') {
            v['show'] = false
          }
        })
      })
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
    computed: {
      isCompare () {
        return this.multipleSelection.length !== 2
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

        this.request(Services.clickStatList, params, (remoteData) => {
          this.tableData = remoteData.data
          // this.pageSize = remoteData.page_size
          this.total = parseInt(remoteData.total)
        })
      },
      onDetail (idx, rowData) {
        this.tabs.forEach((v, i) => {
          v['show'] = true
        })
        let id = rowData['id'] || 12
        this.$router.push({name: 'detail', query: { id: id, start_time: rowData.push_start_time }})
      },
      onDevice (idx, rowData) {
        this.tabs.forEach((v, i) => {
          v['show'] = true
        })
        let id = rowData['id'] || 12
        this.$router.push({name: 'device', query: { id: id, start_time: rowData.push_start_time }})
      },
      compare () {
        let compareIds = this.multipleSelection.map((v, i) => {
          return v['id']
        })
        this.$router.push({name: 'compare', query: { id: compareIds.join() }})
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      }
    },
    components: {
      elAlert: Alert, elTable: Table, elTableColumn: TableColumn, Loading, elPagination: Pagination, constant, datePicker, vSelect, vButton, vTitle, vInput, elButton: Button, elRow: Row, elCol: Col
    }
  }
</script>
