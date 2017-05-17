import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import sendRecord from '../entry/smsrecord/sendRecord'
import replyRrcord from '../entry/smsrecord/replyRecord'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/send',
      name: 'send',
      component: sendRecord
    },
    {
      path: '/reply',
      name: 'reply',
      component: replyRrcord
    },

    {
      path: '/',
      redirect: {
        name: 'send'
      }
    }
  ]
})
