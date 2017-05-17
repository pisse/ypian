<template>
  <div class="main contacts">
    <ui-header></ui-header>
    <div class="mainContainer">
      <side-menu defautActive="4"></side-menu>
      <div class="right clearfix">
        <tabs :routers="routers"></tabs>

        <!-- 路由出口 -->
        <!-- 路由匹配到的组件将渲染在这里 -->
        <router-view></router-view>

      </div>
    </div>
  </div>
</template>

<script>
import Header from 'components/header/header'
import sideMenu from 'components/sideMenu/side'
import tabs from './common/tabs'

export default {
  name: 'contacts',
  data () {
    return {
      routers: [{name: 'contacts', label: '通讯录管理'}]
    }
  },
  components: {
    uiHeader: Header, sideMenu, tabs
  }
}
</script>

