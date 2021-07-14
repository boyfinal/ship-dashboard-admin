import api from '../api'

export const FETCH_SHIPMENT_DETAIL = 'fetchShipmentDetail'

export const state = {
  shipment: {},
  containers: [],
  container_count: 0,
}

export const mutations = {
  [FETCH_SHIPMENT_DETAIL]: (state, payload) => {
    state.shipment = payload.shipment
    state.containers = payload.shipment.containers
    state.container_count = payload.container_count
  },
}

export const actions = {
  // eslint-disable-next-line no-unused-vars
  async [FETCH_SHIPMENT_DETAIL]({ commit }, payload) {
    let result = { success: true }
    let response = await api.fetchShipment(payload)
    if (!response.shipment) {
      result = {
        success: false,
        message: response.errorMessage || '',
      }
    }
    commit(FETCH_SHIPMENT_DETAIL, response)
    return result
  },
}
