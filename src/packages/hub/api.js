import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'
// import { RESPONSE_TYPE_BLOB } from '@core/constants/http'

export default {
  getContainerImport(payload) {
    return http.get(`/hubs/import/${payload.code}`)
  },
  fetchListContainerImported(payload) {
    return http.get(`/hubs/import?${buildQueryString(payload)}`)
  },
  countListContainerImported(payload) {
    return http.get(`/hubs/import/count?${buildQueryString(payload)}`)
  },
  scanContainerImport(payload) {
    return http.post(`/hubs/import/${payload.code}/scan`)
  },
}
