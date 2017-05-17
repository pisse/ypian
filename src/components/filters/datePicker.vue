<template>
  <div class="search-bar">
    <span class="bar-name">{{opt.name}}:</span>
    <div class="date-time-wrap">
      <el-date-picker v-model="formData[opt['keyStart']]"
                      :format="dateFormat"
                      size="small"
                      :type="type"
                      placeholder="选择开始时间"></el-date-picker>
    </div>
    -
    <div class="date-time-wrap">
      <el-date-picker v-model="formData[opt['keyEnd']]"
                      :format="dateFormat"
                      size="small"
                      :type="type"
                      placeholder="选择结束时间"></el-date-picker>
    </div>
    <span class="date-time-desc" v-if="opt.desc">
      （{{opt.desc}}）
    </span>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
  .search-bar
    .date-time-wrap
      display : inline-block
      min-width : 200px
    .date-time-desc
      color: #999
      font-size : 12px

</style>
<script type="text/ecmascript-6">
  import { DatePicker } from 'element-ui'

  export default {
    data () {
      return {}
    },
    props: {
      opt: Object,
      formData: Object,
      dateFormat: {
        type: String,
        default: 'yyyy-MM-dd HH:mm:ss'
      },
      type: {
        type: String,
        default: 'datatime'
      }
    },
    components: {
      elDatePicker: DatePicker
    }
  }
</script>
