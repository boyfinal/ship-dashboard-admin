import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'
export default {
  getUser() {
    return http.get(`/users`)
  },
  fetchUsersByRole(payload) {
    return http.get(`/users/role?${buildQueryString(payload)}`)
  },
  /**
   * fetch list service
   * @param payload
   * @return {*}
   */
  fetchService(payload) {
    return http.get(`/services/${payload}`)
  },

  /**
   * fetch estimate cost
   * @param payload
   * @return {*}
   */
  fetchEstimateCost(payload) {
    return http.get(`/warehouses/estimate-cost-warehouses/${payload}`)
  },

  /**
   * fetch warehouses
   * @param payload
   * @return {*}
   */
  fetchWareHouses() {
    return http.get(`/warehouses/warehouses`)
  },
}
