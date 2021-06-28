import {
  ACL,
  ORDER_STATUS_FULFILLED,
  ORDER_STATUS_PAID,
  ORDER_STATUS_PROCESS,
} from '@core/constants'
import { clickoutside } from '@core/vue/directives'

const MainPlugin = {
  install(Vue) {
    Vue.prototype.$isLogin = function() {
      return Boolean(this.$store.getters['auth/currentRole'])
    }
    Vue.prototype.$isCutomer = function() {
      return this.$store.getters['auth/isCutomer']
    }
    Vue.prototype.$hasAuthorize = function(key) {
      if (typeof ACL[key] === 'undefined') {
        return false
      }

      const role = this.$store.getters['auth/currentRole']
      return ACL[key].indexOf(role) !== -1
    }

    Vue.prototype.$isVisibleTrackingNumber = function(status) {
      return (
        [
          ORDER_STATUS_PAID,
          ORDER_STATUS_PROCESS,
          ORDER_STATUS_FULFILLED,
        ].indexOf(status) !== -1
      )
    }

    Vue.directive('click-outside', clickoutside)
  },
}

export default MainPlugin
