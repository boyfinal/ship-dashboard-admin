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
  fetchListImported(payload) {
    return http.get(`/hubs/list-import?${buildQueryString(payload)}`)
  },
  getImportHubDetail(payload) {
    let param = new Object()
    param.type = payload.type
    return http.get(
      `/hubs/import-detail/${payload.code}?${buildQueryString(param)}`
    )
  },
  scanExportHub(payload) {
    let param = new Object()
    param.type = payload.type
    return http.post(
      `/hubs/export/${payload.code}/scan?${buildQueryString(param)}`
    )
  },
}
