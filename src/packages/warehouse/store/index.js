import api from '../api'

/**
 * Type
 */
export const FETCH_LIST_PACKAGES_IN_WAREHOUSE = 'fetchPackageInWareHouse'
export const COUNT_LIST_PACKAGES_IN_WAREHOUSE = 'countPackagesInWareHouse'
/**
 * State
 */
export const state = {
  packages_in_warehouse: [],
  count_packages_in_warehouse: 0,
  count_status: [],
  products: [],
  service: [],
}
/**
 * Mutation
 */
export const mutations = {
  [FETCH_LIST_PACKAGES_IN_WAREHOUSE]: (state, payload) => {
    state.packages_in_warehouse = payload
  },
  [COUNT_LIST_PACKAGES_IN_WAREHOUSE]: (state, payload) => {
    state.count_packages_in_warehouse = payload.count
    state.count_status = payload.status_count
  },
}

/**
 * Action
 */

export const actions = {
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
