<template>
  <div class="leftnav" :class="{fold: isFold}">
    <div class="fold-icon" @click="foldMenu">

      <i class="iconfont" :class="{'icon-zhankai': isFold, 'icon-shousuo': !isFold}"></i>
    </div>
    <nav class="left">
      <el-menu :default-active="defautActive" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" @select="handleSelect">
        <el-menu-item index="1"><i class="el-icon-menu"></i><a href="./main.html">管理控制台</a></el-menu-item>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-message"></i>国内短信</template>
            <el-menu-item index="2-1"  v-if="userInfo.is_send_mass =='0'"><a href="./smsbatch.html">短信群发</a></el-menu-item>
            <el-menu-item index="2-2"><a href="./smsrecord.html">短信记录</a></el-menu-item>
            <el-menu-item index="2-3"><a href="./statistic.html">数据统计</a></el-menu-item>
        </el-submenu>

        <!--<el-submenu index="3">
          <template slot="title"><i class="el-icon-edit"></i>短链统计</template>
          <el-menu-item index="3-1"><a href="./clickstat.html">点击统计</a></el-menu-item>
          <el-menu-item index="3-2"><a href="./compare.html">营销对比</a></el-menu-item>
        </el-submenu>-->

        <el-menu-item index="3"><!--<i class="el-icon-menu"></i>--><i class="iconfont icon-yingxiao"></i><a href="./clickstat.html">点击率统计</a></el-menu-item>

        <el-menu-item index="4"><!--<i class="el-icon-menu"></i>--><i class="iconfont icon-tongxunlu-copy"></i><a href="./contacts.html">通讯录</a></el-menu-item>

        <el-submenu index="5">
          <template slot="title"><i class="iconfont icon-caiwu"></i>财务</template>
          <el-menu-item index="5-1"><a href="./financial.html">日账单</a></el-menu-item>
        </el-submenu>

        <el-menu-item index="6"><!--<i class="el-icon-menu"></i>--><i class="el-icon-caret-bottom"></i><a href="./downloads.html">下载任务</a></el-menu-item>

      </el-menu>
    </nav>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">

  .leftnav
    position: fixed
    top: 0
    left: 0
    width: 180px
    height: 100%
    padding-top: 60px
    font-size: 14px
    line-height: 14px
    &.fold
      width: 40px
      .el-submenu__icon-arrow
        display : none
    .fold-icon
      cursor : pointer
      height: 30px
      line-height : 30px
      color:#aeb9c2
      background-color :#4A5064
      font-size : 18px
      text-align : center
      .iconfont
        color:#fff
      .icon-zhankai, .icon-shousuo
        font-size : 22px
        &:hover
          color: #aeb9c2
    .left
      height: 100%
      padding: 0
      overflow: auto
      background: #293038
      padding-bottom: 30px
      &::-webkit-scrollbar
        width: 0
      .iconfont{
        vertical-align: baseline;
        margin-right: 10px;
        margin-left: -5px;
      }
      .el-submenu [class^="el-icon-"], .el-menu-item [class^="el-icon-"]
        margin-left : -5px
      .el-menu
        background-color :#333744
        &>.el-menu-item.is-active
         background: #2cbfff
        .el-menu-item, .el-submenu__title
          color: #fff
          &:hover
            background-color : #4A5064
        .el-submenu__title + .el-menu
          background-color : #293038
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
  // import { menu, menuItem, submenu, menuItemGroup } from 'element-ui'

  export default {
    data () {
      return {
        isFold: false,
        routers: {
          '1': './main.html',
          '2-1': './smsbatch.html',
          '2-2': './smsrecord.html',
          '2-3': './statistic.html',
          '3': './clickstat.html',
          '4': './contacts.html',
          '5-1': './financial.html'
        }
      }
    },
    props: {
      defautActive: String,
      userInfo: Object
    },
    methods: {
      foldMenu () {
        this.isFold = !this.isFold
        let main = document.getElementsByClassName('mainContainer')
        if (this.isFold) {
          main[0].style.paddingLeft = '40px'
        } else {
          main[0].style.paddingLeft = '180px'
        }
      },
      handleSelect (index) {
        if (this.routers[index]) {
          location.href = this.routers[index]
        }
      },
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    },
    components: {
      // elMenu: menu, elMenuItem: menuItem, elSubmenu: submenu, elMenuItemGroup: menuItemGroup
    }
  }
</script>
