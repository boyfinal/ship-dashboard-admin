import api from '../api'

export const FETCH_SHIPMENT_DETAIL = 'fetchShipmentDetail'
export const APPEND_SHIPMENT = 'appendShipment'
export const CANCEL_CONTAINER = 'cancelContainer'
export const CANCEL_SHIPMENT = 'cancelShipment'
export const CLOSE_SHIPMENT = 'closeShipment'

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
  // eslint-disable-next-line no-unused-vars
  async [APPEND_SHIPMENT]({ commit }, payload) {
    let result = { success: true }
    let response = await api.appendShipment(payload)
    if (!response.container || response.errorMessage) {
      result = {
        success: false,
        message: response.errorMessage || '',
      }
      return result
    }
    result.container = response.container
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [CANCEL_CONTAINER]({ commit }, payload) {
    let result = { success: true }
    let response = await api.cancelContainer(payload)
    if (response.error || response.errorMessage) {
      result = {
        success: false,
        message: response.errorMessage || '',
      }
    }
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async [CANCEL_SHIPMENT]({ commit }, payload) {
    let result = { success: true }
    let response = await api.cancelShipment(payload)
    if (response.error || response.errorMessage) {
      result = {
        success: false,
        message: response.errorMessage || '',
      }
    }
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async [CLOSE_SHIPMENT]({ commit }, payload) {
    let result = { success: true }
    let response = await api.closeShipment(payload)
    if (response.error || response.errorMessage) {
      result = {
        success: false,
        message: response.errorMessage || '',
      }
    }
    return result
  },
}
