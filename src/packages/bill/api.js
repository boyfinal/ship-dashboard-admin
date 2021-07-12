import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'

export default {
  billList(payload) {
    return http.get(`/bills?${buildQueryString(payload)}`)
  },

  billCount(payload) {
    return http.get(`/bills/count?${buildQueryString(payload)}`)
  },
}
