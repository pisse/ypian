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

        <el-submenu index="2">
          <template slot="title">hi，您好</template>
          <el-menu-item index="2-1">账户设置</el-menu-item>
          <el-menu-item index="2-2">系统设置</el-menu-item>
          <el-menu-item index="2-3">充值</el-menu-item>
          <el-menu-item index="2-3">退出</el-menu-item>
        </el-submenu>

      </div>
    </el-menu>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">

  .header
    position: fixed
    width: 100%
    min-width: 1220px
    height: 60px
    padding: 0 10px
    background-color: #03a9f4
    z-index: 999
    .el-menu--horizontal .el-submenu .el-submenu__icon-arrow
        color: #fff
    .el-menu--horizontal .el-submenu > .el-menu
      background-color : #03a9f4
    .el-menu--horizontal .el-submenu .el-menu-item
      background-color : inherit
    .logo
      display: block;
      float: left;
      margin-left: 30px;
      width: 96px;
      height: 60px;
      background: url(/static/images/logo.png) no-repeat center;
      background-size: 96px auto;
    .head-nav
      background-color : #03a9f4
      .el-menu-item, .el-submenu__title
        color: #fff
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
