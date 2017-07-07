<template>
  <div class="search-bar constant-cpt">
    <span class="bar-name">{{opt.name}}:</span>
    <div class="constant-content-wrap">{{opt.value}}
      <div class="chosen-sign"></div>
      <i class="el-icon-check"></i>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
.search-bar
  .constant-content-wrap
    display : inline-block
    border: 2px solid #75c2fd
    height: 30px
    line-height : 26px
    margin-right: 5px
    padding: 0 5px
    width: 200px
    position : relative
    cursor : pointer
    border-radius: 4px;
    .chosen-sign
      position: absolute
      right: 0
      bottom: 0
      color: #75c2fd
      width: 0
      height: 0
      border-width: 10px
      border-style: solid
      border-color: transparent #75c2fd #03a9f4 transparent
    .el-icon-check
      right: -2px
      bottom: -8px
      color: white
      position: absolute
      height: 18px
      font-size: 12px


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
