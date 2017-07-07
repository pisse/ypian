import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import contactsManage from '../entry/contacts/manage'
import contactUpload from '../entry/contacts/contactUpload'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/contacts',
      name: 'contacts',
      component: contactsManage
    },
    {
      path: '/upload',
      name: 'upload',
      component: contactUpload
    },
    {
      path: '/',
      redirect: {
        name: 'contacts'
      }
    }
  ]
})
