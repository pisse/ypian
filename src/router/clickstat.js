import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import statistic from '../entry/clickStat/statistic'
import compare from '../entry/clickStat/compare'
import detail from '../entry/clickStat/detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/stat',
      name: 'stat',
      component: statistic
    },
    {
      path: '/compare',
      name: 'compare',
      component: compare
    },
    {
      path: '/detail',
      name: 'detail',
      component: detail
    },

    {
      path: '/',
      redirect: {
        name: 'stat'
      }
    }
  ]
})
