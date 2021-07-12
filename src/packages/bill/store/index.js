import api from '../api'

export const BILL_FETCH = 'billFetch'
export const BILL_COUNT = 'billCount'

export const state = {
  bills: [],
  count: 0,
}

export const mutations = {
  [BILL_FETCH]: (state, payload) => {
    state.bills = payload
  },
  [BILL_COUNT]: (state, payload) => {
    state.count = payload
  },
}

export const actions = {
  async [BILL_FETCH]({ commit }, payload) {
    const res = await api.billList(payload)
    if (!res || res.error) {
      commit(BILL_FETCH, [])
      return { error: true, message: res.errorMessage || '' }
    }

    commit(BILL_FETCH, res.bills || [])
    return { error: false }
  },

  async [BILL_COUNT]({ commit }, payload) {
    const res = await api.billCount(payload)
    if (!res || res.error) {
      commit(BILL_COUNT, 0)
      return { error: true, message: res.errorMessage || '' }
    }

    commit(BILL_COUNT, res.count || 0)
    return { error: false }
  },
}
