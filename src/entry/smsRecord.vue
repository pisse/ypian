<template>
  <div class="main">
    <ui-header @user_info="setUserInfo" ></ui-header>
    <div class="mainContainer">
      <side-menu defautActive="2-2" :userInfo="userInfo"></side-menu>
      <div class="right clearfix">

        <tabs :routers="routers"></tabs>
        <!-- 路由出口 -->
        <!-- 路由匹配到的组件将渲染在这里 -->
        <router-view :userInfo="userInfo"></router-view>

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
      routers: [{name: 'send', label: '发送记录'}, {name: 'reply', label: '用户回复记录'}]
    }
  },
  name: 'smsrecord',
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
