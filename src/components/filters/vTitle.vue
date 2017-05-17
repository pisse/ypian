<template>
  <div class="title-wrap">
      {{text}}
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
  .title-wrap
    padding: 0 0 0 10px;
    font-size: 18px;
    line-height: 40px;
    color: #333;
    background: #f9f9f9;
    border-bottom: 1px solid #e4e4e4;
    margin: 20px 0 10px 0;
</style>
<script type="text/ecmascript-6">

  export default {
    data () {
      return {
      }
    },
    props: {
      text: String
    },
    components: {
    }
  }
</script>
