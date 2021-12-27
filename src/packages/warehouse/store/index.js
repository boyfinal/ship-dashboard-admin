import api from '../api'

export const FETCH_LIST_PACKAGES_IN_WAREHOUSE = 'fetchPackageInWareHouse'
export const COUNT_LIST_PACKAGES_IN_WAREHOUSE = 'countPackagesInWareHouse'
export const FETCH_PACKAGE_DETAIL = 'fetchPackageDetail'
export const RETURN_PACKAGE = 'returnPackage'
export const ACCEPT_PACKAGE_LABEL = 'acceptPackageLabel'
export const WAREHOUSE_CHECK_IN = 'warehouseCheckIn'
export const EXPORT_WAREHOUSE_PACKAGES = 'exportWarehousePackages'
export const IMPORT_CREATE_LABEL_PDF = 'importCreateLabelPdf'
export const CANCEL_LABEL = 'cancelLabel'

import {
  PACKAGE_STATUS_PENDING_PICKUP,
  PACKAGE_STATUS_WAREHOUSE_LABELED,
  PACKAGE_WAREHOUSE_STATUS_RETURN,
} from '../constants'

export const state = {
  package: {},
  packages_in_warehouse: [],
  count_packages_in_warehouse: 0,
  count_status: [],
  products: [],
  service: [],
}

export const mutations = {
  [FETCH_PACKAGE_DETAIL]: (state, payload) => {
    state.package = payload
  },
  [FETCH_LIST_PACKAGES_IN_WAREHOUSE]: (state, payload) => {
    state.packages_in_warehouse = payload
  },
  [COUNT_LIST_PACKAGES_IN_WAREHOUSE]: (state, payload) => {
    state.count_packages_in_warehouse = payload.count
    state.count_status = payload.status_count
  },
  [ACCEPT_PACKAGE_LABEL]: (state, payload) => {
    if (payload.id != state.package.id) return

    let base64 = ''
    if (payload.base64_labels) {
      base64 = /^http/gi.test(payload.base64_labels)
        ? base64
        : `data:image/png;base64,${payload.base64_labels}`
    }

    state.package.status = PACKAGE_STATUS_WAREHOUSE_LABELED
    state.package.tracking = {
      id: payload.track_id,
      base64_label: base64,
      label_url: payload.label_url,
      tracking_number: payload.tracking_number,
    }
  },
  [RETURN_PACKAGE]: (state, id) => {
    if (id != state.package.id) return
    state.package.status = PACKAGE_WAREHOUSE_STATUS_RETURN
  },
  [WAREHOUSE_CHECK_IN]: (state, payload) => {
    state.package = payload
  },
}

export const actions = {
  async [FETCH_PACKAGE_DETAIL]({ commit }, payload) {
    const res = await api.fetchPackageByCode(payload)
    if (!res || res.error) {
      commit(FETCH_PACKAGE_DETAIL, {})
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_PACKAGE_DETAIL, res.package || {})
    return { error: false }
  },

  // eslint-disable-next-line no-unused-vars
  async fetchPackageInWareHouse({ commit }, payload) {
    let result = { success: true }
    let [list, count] = await Promise.all([
      api.fetchListPackageInWareHouse(payload),
      api.countListPackageInWareHouse(payload),
    ])
    if (!list.packages || !count) {
      count = { count: 0 }
      result = {
        success: false,
        message: list.errorMessage || '',
      }
    }
    commit(FETCH_LIST_PACKAGES_IN_WAREHOUSE, list.packages)
    commit(COUNT_LIST_PACKAGES_IN_WAREHOUSE, count)
    return result
  },

  // eslint-disable-next-line
  async [ACCEPT_PACKAGE_LABEL]({ commit }, payload) {
    const res = await api.acceptAndLabel(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    commit(ACCEPT_PACKAGE_LABEL, res)
    return { error: false, data: res }
  },

  // eslint-disable-next-line
  async [RETURN_PACKAGE]({ commit }, payload) {
    const res = await api.returnPackage(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    commit(RETURN_PACKAGE, payload.id)
    return { error: false }
  },

  async [WAREHOUSE_CHECK_IN]({ commit }, code) {
    commit(WAREHOUSE_CHECK_IN, {})

    if (code == '') return { error: false }

    const res = await api.checkIn(code)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    if (res.package.status < PACKAGE_STATUS_PENDING_PICKUP) {
      return { error: true, message: 'Mã vận đơn không tồn tại.' }
    }

    commit(WAREHOUSE_CHECK_IN, res.package)
    return { error: false }
  },

  // eslint-disable-next-line no-unused-vars
  async [EXPORT_WAREHOUSE_PACKAGES]({ commit }, payload) {
    let result = { success: true }
    const response = await api.exportWarehousePackage(payload)

    if (response.error || response.message) {
      result = {
        success: false,
        message: response.errorMessage || response.error || response.message,
      }
    } else {
      result.url = response.download
    }

    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [CANCEL_LABEL]({ commit }, payload) {
    let result = { success: true }
    const response = await api.cancelLabel(payload)

    if (response.error || response.message) {
      result = {
        success: false,
        message: response.errorMessage || response.error || response.message,
      }
    }

    return result
  },

  // eslint-disable-next-line
  async [IMPORT_CREATE_LABEL_PDF]({ commit }, payload) {
    const res = await api.createLabelsPdf(payload)

    if (!res || res.error) {
      return { error: true, message: res.errorMessage }
    }

    return { error: false }
  },
}
