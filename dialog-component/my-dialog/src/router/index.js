import Vue from 'vue'
import Router from 'vue-router'
import Dialog from '@/components/Dialog'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'm-dialog',
      component: Dialog
    }
  ]
})
