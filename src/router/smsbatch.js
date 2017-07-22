import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import batchNew from '../entry/smsbatch/batchNew'
import batchList from '../entry/smsbatch/batchList'
import taskdetail from '../entry/smsbatch/taskdetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/new',
      name: 'new',
      component: batchNew
    },
    {
      path: '/list',
      name: 'list',
      component: batchList
    },
    {
      path: '/taskdetail',
      name: 'taskdetail',
      component: taskdetail
    },

    {
      path: '/',
      redirect: {
        name: 'list'
      }
    }
  ]
})
