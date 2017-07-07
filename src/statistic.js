// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './entry/statistics'
import router from './router/statistics'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'

Vue.use(ElementUI)
Vue.use(VueResource)

import '../theme/index.css'
import 'common/stylus/index.styl'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
