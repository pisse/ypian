<template>
   <div class="header-wrap">
      <div class="header">
          <span class="logo"></span>
          <p class="company">
              <a href="http://www.q1069.com/">首页</a>
              <a href="http://www.q1069.com/index.php?m=content&c=index&a=lists&catid=2">产品中心</a>
              <a href="http://www.q1069.com/index.php?m=content&c=index&a=lists&catid=5">关于我们</a>
          </p>
      </div>
   </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">

  .header-wrap
    background-color :#fff
  .header
    width: 1200px
    height: 100px
    margin : 0 auto
    .logo
      display: block;
      float: left;
      width: 180px;
      height: 100px;
      background: url(../../assets/login-logo.png) no-repeat center;
      background-size: 180px auto;
    .company
      height: 100px
      line-height: 100px;
      float: right
      a
        display :inline-block
        margin-right : 35px




</style>
<script type="text/ecmascript-6">
  // import { menu, menuItem, submenu } from 'element-ui'

  export default {
    data () {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      }
    },
    methods: {
      handleSelect (key, keyPath) {
        console.log(key, keyPath)
      }
    },
    components: {
      // elMenu: menu, elMenuItem: menuItem, elSubmenu: submenu
    }
  }
</script>
