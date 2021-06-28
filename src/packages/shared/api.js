import http from '@core/services/http'

export default {
  getUser() {
    return http.get(`/users`)
  },
}
