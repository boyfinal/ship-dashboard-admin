import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'
import { RESPONSE_TYPE_BLOB } from '@core/constants/http'

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
    return http.post(`/containers`, payload)
  },
  detailContainer(payload) {
    return http.get(`/containers/${payload.code}?${buildQueryString(payload)}`)
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

  downloadLabel(payload) {
    return http.get(
      `/uploads/file-export/download?${buildQueryString(payload)}`,
      RESPONSE_TYPE_BLOB
    )
  },
}
