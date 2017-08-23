import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import list from '../entry/downloads/list.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/list',
      name: 'list',
      component: list
    },
    {
      path: '/',
      redirect: {
        name: 'list'
      }
    }
  ]
})
