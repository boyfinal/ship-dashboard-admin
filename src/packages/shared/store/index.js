import api from '../api'

export const GET_USER = 'getUser'
export const FETCH_ADDRESSES = 'fetchAddresses'
export const LOADING = 'loading'
export const FETCH_SERVICE = 'fetchService'
export const FETCH_ESTIMATE_COST = 'fetchEstimateCost'
export const FETCH_WAREHOUSE = 'fetchWareHouses'

import addresses from '../../../assets/json/address.json'

export const state = {
  user: {},
  addresses: [],
  isLoading: false,
  service_detail: {},
  estimateCost: [],
  wareHouses: [],
}

export const getters = {}

export const mutations = {
  [GET_USER]: (state, payload) => {
    state.user = payload
  },
  [FETCH_ADDRESSES]: (state, payload) => {
    state.addresses = payload
  },
  [LOADING]: (state, payload) => {
    state.isLoading = payload
  },
  [FETCH_SERVICE]: (state, payload) => {
    state.service_detail = payload
  },
  [FETCH_ESTIMATE_COST]: (state, payload) => {
    state.estimateCost = payload
  },
  [FETCH_WAREHOUSE]: (state, payload) => {
    state.wareHouses = payload
  },
}

export const actions = {
  /**
   *
   * @param commit
   * @param payload
   * @return {Promise<{success: boolean}>}
   */
  async getUser({ commit }) {
    let result = { success: true }
    let response = await api.getUser()

    if (response && response.errorMessage) {
      result = { success: false, message: response.errorMessage }
      response.user = {}
    }

    commit(GET_USER, response.user)
    return result
  },

  /**
   * Fetch addresses
   * @param commit
   */
  fetchAddresses({ commit }) {
    commit(FETCH_ADDRESSES, addresses)
  },

  [LOADING]({ commit }, payload) {
    commit(LOADING, payload)
  },

  // eslint-disable-next-line no-unused-vars
  async fetchService({ commit }, payload) {
    let result = { success: true }
    const res = await api.fetchService(payload)

    if (!res.service) {
      result = {
        success: false,
        message: res.errorMessage || '',
      }
      return result
    }
    commit(FETCH_SERVICE, res.service)
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async fetchEstimateCost({ commit }, payload) {
    let result = { success: true }
    const res = await api.fetchEstimateCost(payload)

    if (!res.costs) {
      result = {
        success: false,
        message: res.errorMessage || '',
      }
      return result
    }
    commit(FETCH_ESTIMATE_COST, res.costs)
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async fetchWareHouses({ commit }, payload) {
    let result = { success: true }
    const res = await api.fetchWareHouses(payload)

    if (!res.warehouses) {
      result = {
        success: false,
        message: res.errorMessage || '',
      }
      return result
    }
    commit(FETCH_WAREHOUSE, res.warehouses)
    return result
  },
}
