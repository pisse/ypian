<template>
  <div class="header">
    <el-menu :default-active="activeIndex" class="head-nav" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">
        <a href=""><span class="logo"></span></a>
      </el-menu-item>
      <div class="fr mr20">
        <el-menu-item index="3"><a href="https://www.ele.me" target="_blank">智鼎官网</a></el-menu-item>
        <el-menu-item index="3"><a href="https://www.ele.me" target="_blank">API文档</a></el-menu-item>
        <el-menu-item index="3"><a href="https://www.ele.me" target="_blank">帮助</a></el-menu-item>

      </div>
    </el-menu>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">

  .header
    width: 100%
    height: 60px
    background-color: #fff
    box-shadow : 0 0 20px lightgrey
    .logo
      display: block;
      float: left;
      margin-left: 30px;
      width: 96px;
      height: 60px;
      background: url(/static/images/logo.blue.png) no-repeat center;
      background-size: 96px auto;
    .head-nav
      background-color : #fff
      .el-menu-item, .el-submenu__title
        color: #03a9f4
        &:hover
          background-color : inherit
      .fr
        float: right



</style>
<script type="text/ecmascript-6">
  import { menu, menuItem, submenu } from 'element-ui'

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
      elMenu: menu, elMenuItem: menuItem, elSubmenu: submenu
    }
  }
</script>
