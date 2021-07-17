import api from '../api'

export const GET_USER = 'getUser'
export const FETCH_ADDRESSES = 'fetchAddresses'
export const LOADING = 'loading'
import addresses from '../../../assets/json/address.json'

export const state = {
  user: {},
  addresses: [],
  isLoading: false,
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
}
