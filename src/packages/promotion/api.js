import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'
export default {
  fetchPromotion(payload) {
    return http.get(`/promotions?${buildQueryString(payload)}`)
  },

  countPromotion(payload) {
    return http.get(`/promotions/count?${buildQueryString(payload)}`)
  },

  updatePromotion(payload) {
    return http.put(`/promotions/${payload.id}`, payload)
  },

  appendUserToPromotion(payload) {
    return http.put('/promotions/append', payload)
  },
}
