import { ACL } from '@core/constants'
import { clickoutside } from '@core/vue/directives'

const MainPlugin = {
  install(Vue) {
    Vue.prototype.$isLogin = function() {
      return Boolean(this.$store.getters['auth/currentRole'])
    }
    Vue.prototype.$isAdmin = function() {
      return this.$store.getters['auth/isAdmin']
    }
    Vue.prototype.$isSupport = function() {
      return this.$store.getters['auth/isSupport']
    }
    Vue.prototype.$isAccountant = function() {
      return this.$store.getters['auth/isAccountant']
    }
    Vue.prototype.$isWarehouse = function() {
      return this.$store.getters['auth/isWarehouse']
    }
    Vue.prototype.$hasAuthorize = function(key) {
      if (typeof ACL[key] === 'undefined') {
        return false
      }

      const role = this.$store.getters['auth/currentRole']
      return ACL[key].indexOf(role) !== -1
    }

    Vue.directive('click-outside', clickoutside)
  },
}

export default MainPlugin
