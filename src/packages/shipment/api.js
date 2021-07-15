import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'

export default {
  /**
   * fetch list product
   * @param payload
   * @return {*}
   */

  fetchShipment(payload) {
    return http.get(`/shipments/${payload.id}?${buildQueryString(payload)}`)
  },
  appendShipment(payload) {
    return http.put(`/shipments/append`, payload)
  },
  cancelContainer(payload) {
    return http.put(`/shipments/cancel-container/`, payload)
  },
  cancelShipment(payload) {
    return http.put(`/shipments/cancel/${payload.id}`)
  },
  closeShipment(payload) {
    return http.put(`/shipments/close/${payload.id}`)
  },
}
