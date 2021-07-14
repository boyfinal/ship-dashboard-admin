import api from '../api'

export const FETCH_LIST_PACKAGES_IN_WAREHOUSE = 'fetchPackageInWareHouse'
export const COUNT_LIST_PACKAGES_IN_WAREHOUSE = 'countPackagesInWareHouse'
export const FETCH_PACKAGE_DETAIL = 'fetchPackageDetail'

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
}

export const actions = {
  async [FETCH_PACKAGE_DETAIL]({ commit }, payload) {
    const res = await api.fetchPackage(payload)
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
}
