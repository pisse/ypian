<template>
    <div class="main contacts">
        <ui-header @user_info="setUserInfo"></ui-header>
        <div class="mainContainer">
            <side-menu defautActive="6" :userInfo="userInfo"> </side-menu>
            <div class="right clearfix">
                <tabs :routers="routers"  ref="tabs"></tabs>

                <!-- 路由出口 -->
                <!-- 路由匹配到的组件将渲染在这里 -->
                <router-view @routeChange="routeChange"></router-view>

            </div>
        </div>
    </div>
</template>

<script>
  import Vue from 'vue'
  import Header from 'components/header/header'
  import sideMenu from 'components/sideMenu/side'
  import tabs from './common/tabs'

  /* import ElementUI from 'element-ui'

   Vue.use(ElementUI) */

  export default {
    name: 'contacts',
    data () {
      return {
        userInfo: {},
        routers: [{name: 'list', label: '下载列表'}]
      }
    },
    methods: {
      routeChange (name) {
        this.$refs.tabs.routerName = name
      },
      setUserInfo (info) {
        this.userInfo = info
      }
    },
    components: {
      uiHeader: Header, sideMenu, tabs
    }
  }
</script>

