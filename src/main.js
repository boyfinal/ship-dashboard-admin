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
import './core/icons'
import { VclTable } from 'vue-content-loading'
Vue.use(VueClipboard)

import VueQuillEditor from 'vue-quill-editor/dist/ssr'
Vue.use(VueQuillEditor)
import * as Quill from 'quill'

const alignClass = Quill.import('attributors/style/align')
const backgroundClass = Quill.import('attributors/style/background')
const colorClass = Quill.import('attributors/style/color')
const directionClass = Quill.import('attributors/style/direction')
const fontClass = Quill.import('attributors/style/font')
const sizeClass = Quill.import('attributors/style/size')
sizeClass.whitelist = ['12px', '14px', '16px', '18px', '20px']
Quill.register(sizeClass, true)
Quill.register(alignClass, true)
Quill.register(backgroundClass, true)
Quill.register(colorClass, true)
Quill.register(directionClass, true)
Quill.register(fontClass, true)

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
