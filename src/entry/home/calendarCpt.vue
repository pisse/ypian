<template>
    <div class="calendar-cpt">
        <datepicker :inline="true" language="zh" :highlighted="highlighted"></datepicker>
    </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
.calendar-cpt
  height: 315px;
  margin-bottom : 10px;
  .vdp-datepicker
      height: 100%
      .vdp-datepicker__calendar
        width: 100%
        height: 100%
        border : 0

</style>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import Datepicker from 'vuejs-datepicker'

  export default {
    data () {
      return {
        highlighted: {
          dates: [ // Highlight an array of dates
            new Date()
          ]
        }
      }
    },
    components: {
      Datepicker
    }
  }
</script>
