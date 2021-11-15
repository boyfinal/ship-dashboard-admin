import Vue from 'vue'
import Notifications from 'vue-notification'
import VueClipboard from 'vue-clipboard2'
import App from './App.vue'
import MainPlugin from './plugins/main'
// import DashboardPlugin from './material-dashboard'
import * as filters from './core/helpers/filters'
import initGlobalDirectives from '@core/vue/directives'
import router from './core/router'
import store from './core/store'
import '../uikit'
import { VclTable } from 'vue-content-loading'

Vue.use(VueClipboard)

Vue.use(Notifications)
Vue.use(MainPlugin)
Vue.component('VclTable', VclTable)
initGlobalDirectives()

Vue.mixin({
  methods: {
    $evaluate: (param) => eval('this.' + param),
  },
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

// Register global utility filters.
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})
