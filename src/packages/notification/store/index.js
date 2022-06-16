import api from '../api'

export const FETCH_LIST_NOTIFY_EMAIL = 'fetchListNotifyEmail'
export const COUNT_NOTIFY_EMAIL = 'countNotifyEmail'
export const CREATE_NOTIFY_EMAIL = 'createNotifyEmail'
export const state = {
  notifyEmails: [],
  countNotifyEmails: 0,
}

export const mutations = {
  [FETCH_LIST_NOTIFY_EMAIL]: (state, payload) => {
    state.notifyEmails = payload
  },
  [COUNT_NOTIFY_EMAIL]: (state, payload) => {
    state.countNotifyEmails = payload
  },
}

export const actions = {
  // eslint-disable-next-line no-unused-vars
  async [FETCH_LIST_NOTIFY_EMAIL]({ commit }, payload) {
    let result = { success: true }

    let [list, count] = await Promise.all([
      api.fetchListNotifyEmail(payload),
      api.countNotifyEmail(payload),
    ])

    if (!list.notifies || !count.count) {
      count = { count: 0 }
      result = {
        success: false,
        message: list.errorMessage || '',
      }
    }
    commit(FETCH_LIST_NOTIFY_EMAIL, list.notifies)
    commit(COUNT_NOTIFY_EMAIL, count.count)
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [CREATE_NOTIFY_EMAIL]({ commit }, payload) {
    let result = { success: true }

    let response = await api.createNotifyEmail(payload)
    if (!response || !response.success) {
      result = {
        success: false,
        message: response.errorMessage,
      }
    }
    return result
  },
}
