<template>
  <div class="main contacts">
    <ui-header @user_info="setUserInfo"></ui-header>
    <div class="mainContainer">
      <side-menu defautActive="2-1"></side-menu>
      <div class="right clearfix">
        <tabs :routers="routers" ref="tabs"></tabs>

        <!-- 路由出口 -->
        <!-- 路由匹配到的组件将渲染在这里 -->
       <!-- <keep-alive>-->
          <router-view :userInfo="userInfo" :tabs="routers"></router-view>
       <!-- </keep-alive>-->
      </div>
    </div>
  </div>
</template>

<script>
import Header from 'components/header/header'
import sideMenu from 'components/sideMenu/side'
import tabs from './common/tabs'

export default {
  name: 'batch',
  data () {
    return {
      userInfo: {},
      routers: [{name: 'list', label: '群发申请'}, {name: 'new', label: '新建群发计划', show: false}]
    }
  },
 /* beforeRouteEnter (to, from, next) {
    next(vm => {
      console.log('router change')
    })
  }, */
  watch: {
    routers: {
      handler: function (val, oldVal) {
        this.$refs.tabs.routerName = this.$route.name
      },
      deep: true
    }
  },
  methods: {
    setUserInfo (info) {
      this.userInfo = info
    }
  },
  components: {
    uiHeader: Header, sideMenu, tabs
  }
}
</script>

