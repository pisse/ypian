<template>
  <div class="search-bar label-cpt">
    <span class="bar-name">{{opt.name}}:</span>
    <div class="label-content-wrap">{{opt.value}}</div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
  .search-bar
    .label-content-wrap
      display : inline-block
      // border: 2px solid #03a9f4
      height: 30px
      line-height : 30px
      margin-right: 5px
      padding: 0 5px
      width: 200px
      position : relative
      cursor : pointer



</style>
<script type="text/ecmascript-6">

  export default {
    data () {
      return {
      }
    },
    props: {
      opt: Object
    },
    components: {
    }
  }
</script>
