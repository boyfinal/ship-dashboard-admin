import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'
export default {
  getUser() {
    return http.get(`/users`)
  },
  fetchUsersByRole(payload) {
    return http.get(`/users/role?${buildQueryString(payload)}`)
  },
}
