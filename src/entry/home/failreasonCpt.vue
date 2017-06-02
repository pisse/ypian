<template>
  <div class="failed-reason-cpt cpt"  v-loading="isloading">
    <div class="title"><a href="smsrecord.html#/fail">失败原因统计</a>
      <div class="dataType">
        <span class="week" :class="{'active': type=='week'}" @click="select('week')">周</span>
        <span class="linebar"></span>
        <span class="month" :class="{'active': type=='month'}" @click="select('month')">月</span>
      </div>
    </div>
    <div class="nodataDiv" v-if="noData">
      <div class="nodata">暂无数据</div>
      <div class="legend">
        <div class="item">
          <div class="square square1"></div>
          运营商
        </div>
        <div class="item">
          <div class="square square2"></div>
          接收端故障
        </div>
        <div class="item">
          <div class="square square3"></div>
          黑名单
        </div>
      </div>
    </div>
    <div class="" v-else>
      <div id="failChart"></div>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
.failed-reason-cpt
  // margin: 10px 0 0
  .title .dataType
    float: right;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    .active
      color: #03a9f4;
    .linebar
      display: inline-block;
      vertical-align: top;
      width: 1px;
      height: 12px;
      margin: 2px 10px 0;
      background: #eae7e7;
  .nodataDiv
    padding-bottom: 20px;
    .nodata
      width: 200px;
      height: 200px;
      margin: 20px auto 0;
      padding: 94px 0 0 0;
      color: #666666;
      border-radius: 50%;
      background: #fafafa;
      text-align: center;
    .legend
      margin: 20px 0 0 20px;
      text-align: center;
      .item
        display: inline-block;
        margin-right: 10px;
        .square
          width: 14px;
          height: 14px;
          margin-right: 10px;
          display: inline-block;
          vertical-align: top
        .square1
          background: #297cbb;
        .square2
          background: #03a9f4;
        .square3
          background: #5d6877;

</style>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import { Loading } from 'element-ui'
  import Services from 'common/js/services.js'
  import moment from 'moment'
  Vue.use(Loading.directive)
  import statisticMixin from '../mixin/statistic'

  const dateFormat = 'YYYY-MM-DD'

  export default {
    mixins: [statisticMixin],
    data () {
      return {
        type: 'week',
        isloading: false,
        noData: true
      }
    },
    watch: {
      type () {
        this.getData()
      }
    },
    created () {
      this.getData()
    },
    methods: {
      getData () {
        let type = this.type
        let num = type == 'week' ? 7 : 30
        let params = {
          start_date: moment().subtract(num, 'days').format(dateFormat),
          end_date: moment().subtract(1, 'days').format(dateFormat)
        }
        this.isloading = true
        this.$http.jsonp(Services.dataHistoryeFail, {
          params: params
        }).then((res) => {
          res = res.json()
          return res
        }).then((remoteData) => {
          this.isloading = false
          if (remoteData.code == 0) {
            this.noData = false
            this.$nextTick(() => {
              this.formatFail(remoteData.data)
            })
          }
        })
      },
      formatFail (data) {
        let ret = {
          ele: 'failChart',
          categories: [],
          series: [],
          type: 'pie',
          height: 280,
          marginLeft: 1,
          marginRight: 1
        }
        let lineObj = {
          name: '失败原因',
          data: [],
          type: 'pie'
        }
        let tableData = []
        for (var k in data) {
          lineObj['data'].push(['原因' + data[k]['reason'], data[k]['reason_total']])
        }
        ret.series.push(lineObj)
        this.drawLine(ret)
      },
      select (val) {
        this.type = val
      }
    },
    components: {
    }
  }
</script>
