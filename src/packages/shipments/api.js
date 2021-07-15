import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'

export default {
  fetchListShipments(payload) {
    return http.get(`/shipments?${buildQueryString(payload)}`)
  },
  countListShipments(payload) {
    return http.get(`/shipments/count?${buildQueryString(payload)}`)
  },
  createShipment() {
    return http.post(`/shipments/create`)
  },
}
