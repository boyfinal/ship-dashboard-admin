import api from '../api'

export const GET_USER = 'getUser'
export const FETCH_ADDRESSES = 'fetchAddresses'
export const LOADING = 'loading'
export const FETCH_SERVICE = 'fetchService'

import addresses from '../../../assets/json/address.json'

export const state = {
  user: {},
  addresses: [],
  isLoading: false,
  service_detail: {},
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
}
