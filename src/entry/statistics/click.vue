<template>
  <div class="statistic-send">
    <div class="search-box">
      <date-picker :formData="formData" :opt="dataRange"></date-picker>
      <br/>
      <constant :opt="account"></constant>
      <br/>
      <v-button text="查询" @search="search"></v-button>
      <v-title text="短信发送量概览"></v-title>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
</style>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import { Alert, DatePicker, Loading, Table, TableColumn, Pagination } from 'element-ui'
  import constant from 'components/filters/constant'
  import datePicker from 'components/filters/datePicker'
  import vButton from 'components/filters/vButton'
  import vTitle from 'components/filters/vTitle'
  import vRadio from 'components/filters/vRadio'
  import moment from 'moment'

  Vue.use(Loading.directive)

  const dateFormat = 'YYYY-MM-DD HH:mm:ss'
  export default {
    data () {
      return {
        isloading: false,
        multipleSelection: [],
        currentPage4: 2,
        account: {name: '账户名', value: 'changdlerHuang'},
        dataRange: {
          name: '起止时间',
          keyStart: 'start_date',
          keyEnd: 'end_date',
          desc: '可查询三个月内记录'
        },
        types: {
          name: '接受状态',
          key: 'statistic_type',
          items: [{label: '实时统计（今日）', val: 'realtime'}, {label: '历史统计', val: 'history'}]
        },
        formData: {
          statistic_type: 'realtime',
          phone: '',
          start_date: moment().subtract(2, 'days').hour(0).minute(0).second(0).format(dateFormat),
          end_date: moment().hour(23).minute(59).second(59).format(dateFormat)
        }
      }
    },
    methods: {
      search () {
        this.formData['start_date'] = moment(this.formData['start_date']).format(dateFormat)
        console.log(this.formData)
      }
    },
    components: {
      elAlert: Alert, elTable: Table, elTableColumn: TableColumn, Loading, elPagination: Pagination, elDatePicker: DatePicker, constant, datePicker, vButton, vTitle, vRadio
    }
  }
</script>
