import Vue from 'vue'
import App from './App.vue'
import {HeroAni} from './index'
Vue.use(HeroAni,500)
new Vue({
  el: '#app',
  render: h => h(App)
})
