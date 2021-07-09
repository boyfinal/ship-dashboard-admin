import api from '../api'

/**
 * Type
 */
export const FETCH_PACKAGE_DETAIL = 'fetchPackage'

export const FETCH_LIST_PACKAGES = 'fetchListPackages'
export const COUNT_LIST_PACKAGES = 'countListPackages'
export const FETCH_LIST_PRODUCTS = 'fetchListProducts'
export const FETCH_LIST_SERVICE = 'fetchListService'
export const IMPORT_PACKAGE = 'importPackage'
export const UPDATE_PACKAGE = 'updatePackage'
export const PROCESS_PACKAGE = 'processPackage'
export const CANCEL_PACKAGES = 'cancelPackages'

export const EXPORT_PACKAGE = 'exportPackage'
export const GET_SERVICE = 'getService'
/**
 * State
 */
export const state = {
  package_detail: {
    package: {},
    deliver_logs: [],
    price: 0.0,
    extra_fee: [],
    audit_logs: [],
  },
  packages: [],
  countPackages: 0,
  count_status: [],
  products: [],
  service: [],
}
/**
 * Getters
 */
export const getters = {
  [GET_SERVICE](state) {
    let sv = state.service.map((item) => {
      return { id: item.id, name: item.name }
    })
    return sv
  },
}
/**
 * Mutation
 */
export const mutations = {
  [FETCH_PACKAGE_DETAIL]: (state, payload) => {
    state.package_detail = payload
  },
  [FETCH_LIST_PACKAGES]: (state, payload) => {
    state.packages = payload
  },
  [FETCH_LIST_PRODUCTS]: (state, payload) => {
    state.products = payload
  },
  [FETCH_LIST_SERVICE]: (state, payload) => {
    state.service = payload
  },
  [COUNT_LIST_PACKAGES]: (state, payload) => {
    state.countPackages = payload.count
    state.count_status = payload.status_count
  },
}

/**
 * Action
 */

export const actions = {
  async fetchPackage({ commit }, payload) {
    const res = await api.fetchPackage(payload)

    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_PACKAGE_DETAIL, res)
  },
  // eslint-disable-next-line no-unused-vars
  async fetchListPackages({ commit }, payload) {
    let result = { success: true }
    let [list, count] = await Promise.all([
      api.fetchListPackages(payload),
      api.countListPackages(payload),
    ])
    if (!list.packages || !count) {
      count = { count: 0 }
      result = {
        success: false,
        message: list.errorMessage || '',
      }
    }
    commit(FETCH_LIST_PACKAGES, list.packages)
    commit(COUNT_LIST_PACKAGES, count)
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async fetchListProducts({ commit }, payload) {
    const res = await api.fetchListProduct()
    if (!res.products) {
      return { error: true, message: res.errorMessage || '' }
    }
    commit(FETCH_LIST_PRODUCTS, res.products)
    return { error: false }
  },
  // eslint-disable-next-line no-unused-vars
  async fetchListService({ commit }, payload) {
    const res = await api.fetchListService()

    if (!res.services) {
      return { error: true, message: res.errorMessage || '' }
    }
    commit(FETCH_LIST_SERVICE, res.services)
    return { error: false }
  },
  // eslint-disable-next-line no-unused-vars
  async updatePackage({ commit }, payload) {
    const res = await api.updatePackage(payload)
    if (!res || !res.package) {
      return { error: true, message: res.errorMessage || '' }
    }
    return { error: false }
  },
  // eslint-disable-next-line no-unused-vars
  async [IMPORT_PACKAGE]({ commit }, payload) {
    const response = await api.importPackage(payload)

    if (
      response &&
      typeof response.errors !== 'undefined' &&
      typeof response.total !== 'undefined' &&
      (response.errors.length || response.total > 0)
    ) {
      return {
        success: true,
        ...response,
      }
    }

    return {
      success: false,
      message: response.errorMessage || '',
    }
  },
  // eslint-disable-next-line no-unused-vars
  async [EXPORT_PACKAGE]({ commit }, payload) {
    let result = { success: true }
    const response = await api.exportPackage(payload)

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
  async processPackage({ commit }, payload) {
    let result = { success: true }
    const res = await api.processPackage(payload)
    if (res.error || res.message) {
      result = {
        success: false,
        message: res.errorMessage || res.error || res.message,
      }
    }
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async cancelPackages({ commit }, payload) {
    let result = { success: true }
    const res = await api.cancelPackages(payload)
    if (res.error || res.message) {
      result = {
        success: false,
        message: res.errorMessage || res.error || res.message,
      }
    }
    return result
  },
}
