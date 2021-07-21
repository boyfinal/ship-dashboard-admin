import api from '../api'

export const FETCH_LIST_PACKAGES_IN_WAREHOUSE = 'fetchPackageInWareHouse'
export const COUNT_LIST_PACKAGES_IN_WAREHOUSE = 'countPackagesInWareHouse'
export const FETCH_PACKAGE_DETAIL = 'fetchPackageDetail'
export const RETURN_PACKAGE = 'returnPackage'
export const ACCEPT_PACKAGE_LABEL = 'acceptPackageLabel'
export const WAREHOUSE_CHECK_IN = 'warehouseCheckIn'

import {
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

    state.package.status = PACKAGE_STATUS_WAREHOUSE_LABELED
    state.package.tracking = {
      id: payload.track_id,
      base64_label: `data:image/png;base64,${payload.base64_labels}`,
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

    commit(WAREHOUSE_CHECK_IN, res.package)
    return { error: false }
  },
}
