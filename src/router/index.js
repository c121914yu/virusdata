import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import main from '../components/main.vue'

export default new Router({
  routes: [
    {path: '/',name: 'main',component: main}
  ]
})
