import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import send from '../entry/statistics/send'
import delay from '../entry/statistics/delay'
import fail from '../entry/statistics/fail'
import register from '../entry/statistics/register'
import arrive from '../entry/statistics/arrive'
import click from '../entry/statistics/click'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/send',
      name: 'send',
      component: send
    },
    {
      path: '/delay',
      name: 'delay',
      component: delay
    },
    {
      path: '/fail',
      name: 'fail',
      component: fail
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/arrive',
      name: 'arrive',
      component: arrive
    },
    {
      path: '/click',
      name: 'click',
      component: click
    },

    {
      path: '/',
      redirect: {
        name: 'send'
      }
    }
  ]
})
