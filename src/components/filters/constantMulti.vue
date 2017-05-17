<template>
  <div class="search-bar constant-cpt">
    <span class="bar-name">{{opt.label}}:</span>
    <div class="constant-content-group">
      <div class="constant-content-item" :class="{'selected': formData[opt['key']]==item.value}" @click="select(item.value)" v-for="(item, idx) in opt.items">{{item.name}}
        <div class="chosen-sign"></div>
        <i class="el-icon-check"></i>
      </div>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
.search-bar
  .constant-content-group
    display :inline-block
  .constant-content-item
    display : inline-block
    border: 1px solid #e4e4e4
    height: 30px
    line-height : 26px
    margin-right: 5px
    padding: 0 5px
    width: 200px
    position : relative
    cursor : pointer
    border-radius: 4px
    .chosen-sign
     display :none
    .el-icon-check
      display : none
    &.selected
      border: 2px solid #03a9f4
      .chosen-sign
        display :inline-block
        position: absolute
        right: 0
        bottom: 0
        color: #03a9f4
        width: 0
        height: 0
        border-width: 10px
        border-style: solid
        border-color: transparent #03a9f4 #03a9f4 transparent
      .el-icon-check
        display :inline-block
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
      opt: Object,
      formData: Object
    },
    methods: {
      select (val) {
        this.$emit('select', val)
      }
    },
    components: {
    }
  }
</script>
