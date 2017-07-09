<template>
  <div class="main">
    <ui-header @user_info="setUserInfo"></ui-header>
    <div class="mainContainer">
      <side-menu defautActive="2-3"></side-menu>
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
      routers: [
        {name: 'send', label: '短信发送量'},
        {name: 'arrive', label: '短信发送状态'},
        {name: 'fail', label: '短信失败原因'},
        {name: 'delay', label: '短信耗时'}
       /* {name: 'register', label: '注册成功率'},
        {name: 'click', label: '点击统计'} */
      ]
    }
  },
  name: 'statistic',
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
