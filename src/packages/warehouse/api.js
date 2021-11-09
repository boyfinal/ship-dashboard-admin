import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'
import { RESPONSE_TYPE_BLOB } from '@core/constants/http'

export default {
  /**
   * fetch package
   * @param payload
   * @return {*}
   */
  fetchPackage(payload) {
    return http.get(`/packages/${payload}`)
  },

  fetchPackageByCode(payload) {
    return http.get(`/packages/${payload}/code`)
  },

  /**
   * fetch list product
   * @param payload
   * @return {*}
   */
  fetchListProduct() {
    return http.get(`/products`)
  },
  /**
   * fetch list service
   * @param payload
   * @return {*}
   */
  fetchListService() {
    return http.get(`/services`)
  },
  fetchListPackageInWareHouse(payload) {
    return http.get(
      `/warehouses/packages-in-warehouse?${buildQueryString(payload)}`
    )
  },
  countListPackageInWareHouse(payload) {
    return http.get(
      `/warehouses/packages-in-warehouse/count?${buildQueryString(payload)}`
    )
  },
  importPackage(payload) {
    const formData = new FormData()

    formData.append('file', payload.file)
    return http.post('/packages/import', formData)
  },
  exportPackage(payload) {
    return http.post('/packages/export', payload)
  },
  updatePackage(payload) {
    return http.put(`/packages/${payload.id}`, payload)
  },
  processPackage(payload) {
    return http.post(`/packages/process`, payload)
  },
  fetchBarcodeFile(payload) {
    return http.get(
      `/uploads/file-export/download?${buildQueryString(payload)}`,
      RESPONSE_TYPE_BLOB
    )
  },
  cancelPackages(payload) {
    return http.put(`/packages/cancel`, payload)
  },

  // duyet don va tao label
  acceptAndLabel(payload) {
    return http.post(`/warehouses/packages/${payload.id}/accept`, payload)
  },

  returnPackage(payload) {
    return http.post(`/warehouses/packages/${payload.id}/return`, payload)
  },
  checkIn(code) {
    return http.get(`/warehouses/packages/${code}/check-in`)
  },
  exportWarehousePackage(payload) {
    return http.post('/warehouses/export', payload)
  },
  createLabelsPdf(payload) {
    const formdata = new FormData()
    formdata.append('file', payload.file)
    return http.post('/warehouses/pdf-labels', formdata)
  },
}
