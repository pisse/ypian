<template>
  <div class="header">
    <el-menu :default-active="activeIndex" class="head-nav" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">
        <a href="./main.html"><span class="logo"></span></a>
      </el-menu-item>
      <div class="fr">
      <!--  <el-menu-item index="3"><a href="" target="_blank">智鼎官网</a></el-menu-item>
        <el-menu-item index="3"><a href="" target="_blank">API文档</a></el-menu-item>
        <el-menu-item index="3"><a href="" target="_blank">帮助</a></el-menu-item>-->

        <el-submenu index="2">
          <template slot="title">您好，{{userInfo.username}}</template>
          <el-menu-item index="logout" class="logout"><i class="iconfont icon-tuichu"></i>退出</el-menu-item>
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
    /*padding: 0 10px*/
    background-color: rgb(51,51,51)
    box-shadow: 0 0 20px #d3d3d3;
    z-index: 999
    .el-menu--horizontal .el-submenu .el-submenu__icon-arrow
        color: #fff
    /*.el-menu--horizontal .el-submenu > .el-menu
      background-color : #75c2fd
    .el-menu--horizontal .el-submenu .el-menu-item
      background-color : inherit
    .el-submenu
      .el-submenu__title, .el-icon-caret-bottom:before
        color: rgb(51,51,51)
    .el-menu--horizontal .el-submenu .el-menu-item
      color: rgb(51,51,51)*/
    .logo
      display: block;
      float: left;
      margin-left: 0px;
      width: 96px;
      height: 60px;
      background: url(../../assets/logo.png) no-repeat center;
      background-size: 96px auto;
    .head-nav
      background-color : #373d41
      &.el-menu--horizontal .el-menu-item
        border-bottom : none
      &.el-menu--horizontal > .el-menu-item:hover
        border-bottom : none
      .el-menu-item, .el-submenu__title
        color: #fff
        &:hover
          background-color : inherit
        &.logout
          color: rgb(51,51,51)
          text-align : center
      .fr
        float: right



</style>
<script type="text/ecmascript-6">
  import _request from '../../entry/mixin/request.js'
  import Services from 'common/js/services.js'

  export default {
    mixins: [_request],
    data () {
      return {
        activeIndex: '1',
        activeIndex2: '1',
        userInfo: {}
      }
    },
    created () {
      this.getUserInfo()
    },
    methods: {
      getUserInfo () {
        this.requestPost(Services.userInfo, {}, (remoteData) => {
          this.userInfo = remoteData.data || {}
          this.$emit('user_info', this.userInfo)
        })
      },
      confirm () {
        this.$confirm('确认退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.logout()
        })
      },
      logout () {
        this.$http.jsonp(Services.userLoginOut, {
        }).then((res) => {
          res = res.json()
          return res
        }).then((remoteData) => {
          if (remoteData.code === 0) {
            window.location.href = './login.html'
          }
        })
      },
      handleSelect (key, keyPath) {
        if (key == 'logout') {
          this.confirm()
        }
      }
    },
    components: {
    }
  }
</script>
