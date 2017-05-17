<template>
  <div class="notice-cpt cpt" _v-00c61200="">
    <div class="title" _v-00c61200=""><a href="/admin/module/notice?from=indexbox" target="_blank" _v-00c61200="">公告</a></div>
    <div class="announcement-list list" _v-00c61200="">

      <notice-item v-for="n in 7" :key="n"></notice-item>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
.notice-cpt
  height: 315px
.announcement-list
  height: 258px;
  padding: 0 20px 20px;
  overflow: hidden;
</style>
<script type="text/ecmascript-6">
  import {Button, Tooltip} from 'element-ui'
  import noticeItem from './noticeItem'

  export default {
    data () {
      return {}
    },
    components: {
      noticeItem
    }
  }
</script>
