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
}
