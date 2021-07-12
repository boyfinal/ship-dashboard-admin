import api from '../api'

export const FETCH_LIST_TRANSACTIONS = 'fetchListTransactions'
export const COUNT_LIST_TRANSACTIONS = 'countListTransactions'

export const state = {
  transaction_logs: [],
  count: 0,
  count_status: [],
}

export const mutations = {
  [FETCH_LIST_TRANSACTIONS]: (state, payload) => {
    state.transaction_logs = payload
  },
  [COUNT_LIST_TRANSACTIONS]: (state, payload) => {
    state.count = payload.count
    state.count_status = payload.all
  },
}

export const actions = {
  // eslint-disable-next-line no-unused-vars
  async [FETCH_LIST_TRANSACTIONS]({ commit }, payload) {
    let result = { success: true }
    let [list, count] = await Promise.all([
      api.fetchTransactionLogs(payload),
      api.countTransactionLogs(payload),
    ])
    if (!list.transaction_logs || !count) {
      count = { count: 0 }
      result = {
        success: false,
        message: list.errorMessage || '',
      }
    }
    commit(FETCH_LIST_TRANSACTIONS, list.transaction_logs)
    commit(COUNT_LIST_TRANSACTIONS, count)
    return result
  },
}
