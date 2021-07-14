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
}
