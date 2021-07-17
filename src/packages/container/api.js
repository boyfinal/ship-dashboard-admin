import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'

export default {
  fetchListContainers(payload) {
    return http.get(`/containers?${buildQueryString(payload)}`)
  },
  countListContainers(payload) {
    return http.get(`/containers/count?${buildQueryString(payload)}`)
  },
  fetchListContainerBoxes() {
    return http.get(`/containers/box`)
  },
  createContainer(payload) {
    return http.post(`/containers/`, payload)
  },
  detailContainer(payload) {
    return http.get(`/containers/${payload.id}`)
  },

  appendPackage(payload) {
    return http.post(`/containers/append`, payload)
  },

  removePackage(payload) {
    return http.put(`/containers/remove`, payload)
  },

  closeContainer(payload) {
    return http.put(`/containers/close/${payload.id}`, payload)
  },

  cancelContainer(payload) {
    return http.put(`/containers/cancel/${payload.id}`, payload)
  },
}
