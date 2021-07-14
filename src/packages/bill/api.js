import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'

export default {
  /**
   * get detail bill
   * @param payload
   * @return {*}
   */
  fetchBillDetail(payload) {
    return http.get(`/bills/${payload.id}?${buildQueryString(payload)}`)
  },

  /**
   * get extra fee
   * @param payload
   * @return {*}
   */
  fetchExtraFee(payload) {
    return http.get(`/bills/fee/${payload.id}?${buildQueryString(payload)}`)
  },
  billList(payload) {
    return http.get(`/bills?${buildQueryString(payload)}`)
  },

  billCount(payload) {
    return http.get(`/bills/count?${buildQueryString(payload)}`)
  },
  cancelExtraFee(payload) {
    return http.post(`/bills/${payload.id}`, payload)
  },
}
