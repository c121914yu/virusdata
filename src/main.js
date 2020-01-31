import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

/* axios */
import axios from 'axios'
Vue.prototype.$axios = axios//全局使用axios

/* 使用echarts */
//引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入地图组件
require('echarts/lib/chart/map')
require('echarts/map/js/china.js')
require('echarts/lib/chart/line')
// 引入提示框和title组件，图例
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/legendScroll')//图例翻译滚动
Vue.prototype.$echarts = echarts

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
