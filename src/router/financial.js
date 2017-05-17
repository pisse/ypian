import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import daily from '../entry/financial/daily'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/daily',
      name: 'daily',
      component: daily
    },
    {
      path: '/',
      redirect: {
        name: 'daily'
      }
    }
  ]
})
