<template>
  <div class="main">
    <ui-header @user_info="setUserInfo"></ui-header>
    <div class="mainContainer">
      <side-menu defautActive="3" :userInfo="userInfo"></side-menu>
      <div class="right clearfix">

        <tabs :routers="routers" ref="tabs"></tabs>
        <!-- 路由出口 -->
        <!-- 路由匹配到的组件将渲染在这里 -->
        <router-view :userInfo="userInfo" :tabs="routers"></router-view>

      </div>
    </div>
  </div>
</template>

<script>
import Header from 'components/header/header'
import sideMenu from 'components/sideMenu/side'
import tabs from './common/tabs'

export default {
  data () {
    return {
      userInfo: {},
      routers: [
        {name: 'stat', label: '点击统计', show: true},
        {name: 'detail', label: '点击统计明细', show: false},
        {name: 'compare', label: '营销对比', show: false},
        {name: 'device', label: '设备统计', show: false}
      ]
    }
  },
  name: 'clickstat',
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
