import api from '../api'

export const FETCH_LIST_SHIPMENT = 'fetchListShipments'
export const COUNT_LIST_SHIPMENTS = 'countListShipments'
export const CREATE_SHIPMENT = 'createShipment'

export const state = {
  shipments: [],
  count: 0,
  count_status: [],
}

export const mutations = {
  [FETCH_LIST_SHIPMENT]: (state, payload) => {
    state.shipments = payload
  },
  [COUNT_LIST_SHIPMENTS]: (state, payload) => {
    state.count = payload.count
    state.count_status = payload.count_status
  },
}

export const actions = {
  // eslint-disable-next-line no-unused-vars
  async [FETCH_LIST_SHIPMENT]({ commit }, payload) {
    let result = { success: true }

    let [list, count] = await Promise.all([
      api.fetchListShipments(payload),
      api.countListShipments(payload),
    ])

    if (!list.shipments || !count) {
      count = { count: 0 }
      result = {
        success: false,
        message: list.errorMessage || '',
      }

      return result
    }
    commit(FETCH_LIST_SHIPMENT, list.shipments)
    commit(COUNT_LIST_SHIPMENTS, count)
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async createShipment({ commit }, payload) {
    let result = { success: true }

    let response = await api.createShipment()
    if (!response || !response.shipment) {
      result = {
        success: false,
        message: response.errorMessage,
      }
    }
    return result
  },
}
