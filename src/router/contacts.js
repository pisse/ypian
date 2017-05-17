import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import contactsManage from '../entry/contacts/manage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/contacts',
      name: 'contacts',
      component: contactsManage
    },
    {
      path: '/',
      redirect: {
        name: 'contacts'
      }
    }
  ]
})
