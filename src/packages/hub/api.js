import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'
import { RESPONSE_TYPE_BLOB } from '@core/constants/http'

export default {
  search(filters) {
    return http.get(`/hubs/search?${buildQueryString(filters)}`)
  },

  countSearch(filters) {
    return http.get(`/hubs/search/count?${buildQueryString(filters)}`)
  },

  return(payload) {
    return http.post(`/hubs/return/${payload.package_id}`, payload)
  },

  fetchFile(payload) {
    return http.get(
      `/uploads/file-export/download?${buildQueryString(payload)}`,
      RESPONSE_TYPE_BLOB
    )
  },

  fetchPackageDetail(package_id) {
    return http.get(`/hubs/packages/${package_id}`)
  },
}
