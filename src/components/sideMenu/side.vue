<template>
  <div class="leftnav">
    <nav class="left">
      <el-menu :default-active="defautActive" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="dark">
        <el-menu-item index="1"><i class="el-icon-menu"></i><a href="./main.html">管理控制台</a></el-menu-item>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-message"></i>国内短信</template>
            <el-menu-item index="2-1"><a href="./smsbatch.html">短信群发</a></el-menu-item>
            <el-menu-item index="2-2"><a href="./smsrecord.html">短信记录</a></el-menu-item>
            <el-menu-item index="2-3"><a href="./statistic.html">数据统计</a></el-menu-item>
        </el-submenu>

        <!--<el-submenu index="3">
          <template slot="title"><i class="el-icon-edit"></i>短链统计</template>
          <el-menu-item index="3-1"><a href="./clickstat.html">点击统计</a></el-menu-item>
          <el-menu-item index="3-2"><a href="./compare.html">营销对比</a></el-menu-item>
        </el-submenu>-->

        <el-menu-item index="3"><i class="el-icon-menu"></i><a href="./clickstat.html">营销分析</a></el-menu-item>

        <el-menu-item index="4"><i class="el-icon-menu"></i><a href="./contacts.html">通讯录</a></el-menu-item>

        <el-submenu index="5">
          <template slot="title"><i class="el-icon-picture"></i>财务</template>
          <el-menu-item index="5-1"><a href="./financial.html">日账单</a></el-menu-item>
        </el-submenu>

      </el-menu>
    </nav>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">

  .leftnav
    position: absolute
    top: 0
    left: 0
    width: 200px
    height: 100%
    padding-top: 60px
    font-size: 14px
    line-height: 14px
    .left
      height: 100%
      padding: 0
      overflow: auto
      background: #3b444f
      padding-bottom: 30px
      &::-webkit-scrollbar
        width: 0
     /* .el-menu
        background-color : inherit
        &>.el-menu-item, & .el-submenu>.el-submenu__title
          color: #999
          border-bottom: 1px solid #49515c
          &:hover
            background-color :#343e4b
        &>.el-menu-item.is-active
          color: 1px solid red
          position: relative
          &:after
            content: '';
            position: absolute;
            top: 50%;
            right: 0;
            height: 0;
            width: 0;
            border: 0 solid transparent;
            border-width: 7px 9px 7px 0;
            border-right-color: #f5f5f5;
            transform: translateY(-50%);
      .el-submenu .el-menu
        background-color : inherit
        .el-menu-item
          border-bottom : 0
          background-color : #2c3643
          color: #d8d8d8
          &:hover
            background-color : #343e4b
          a
            display : inline-block
            width: 100%
*/
</style>
<script type="text/ecmascript-6">
  import { menu, menuItem, submenu, menuItemGroup } from 'element-ui'

  export default {
    data () {
      return {
      }
    },
    props: {
      defautActive: String
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    },
    components: {
      elMenu: menu, elMenuItem: menuItem, elSubmenu: submenu, elMenuItemGroup: menuItemGroup
    }
  }
</script>
