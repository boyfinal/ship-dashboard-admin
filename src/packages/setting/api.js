import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'
export default {
  /**
   * list senders
   * @param payload
   * @return {*}
   */
  listUsers(payload) {
    return http.get(`/users/all?${buildQueryString(payload)}`)
  },

  /**
   * count senders
   * @param payload
   * @return {*}
   */
  countUsers(payload) {
    return http.get(`/users/all/count?${buildQueryString(payload)}`)
  },

  /**
   * Create sender
   * @param payload
   * @return {*}
   */
  createUser(payload) {
    return http.post(`/users/create`, payload)
  },

  /**
   * update status user
   * @param payload
   * @return {*}
   */
  updateStatusUser(payload) {
    return http.put('/users/update-status', payload)
  },

  /**
   * update role user
   * @param payload
   * @return {*}
   */
  updateRoleUser(payload) {
    return http.put('/users/update-role', payload)
  },
  exportPackage(payload) {
    return http.post('/packages/export', payload)
  },
}
