<template>
  <div class="tabs-wrap">
    <el-tabs :value="routerName" @tab-click="handleClick">

      <el-tab-pane v-for="(item, idx) in routers" :key="idx" :name="item.name" :label="item.label"></el-tab-pane>

    </el-tabs>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus">
  .tabs-wrap
    .el-tabs__header
      border-bottom : 2px solid #2cbfff
    .el-tabs__item
      color: black
      height: 31px
      line-height : 31px
      padding: 0 30px
      &.is-active
        background-color: #2cbfff;
        color: white;
        border-color: #2cbfff;

</style>
<script type="text/ecmascript-6">
  import { Tabs, TabPane } from 'element-ui'

  export default {
    data () {
      return {
        routerName: ''
      }
    },
    props: {
      routers: Array
    },
    created () {
      this.routerName = this.$route.name
      console.log(this.routerName)
    },
    methods: {
      handleClick (tab, event) {
        this.$router.push(tab.name)
      }
    },
    components: {
      elTabs: Tabs, elTabPane: TabPane
    }
  }
</script>
