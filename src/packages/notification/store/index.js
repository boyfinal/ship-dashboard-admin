import api from '../api'

export const FETCH_LIST_NOTIFY_EMAIL = 'fetchListNotifyEmail'
export const COUNT_NOTIFY_EMAIL = 'countNotifyEmail'
export const CREATE_NOTIFY_EMAIL = 'createNotifyEmail'
export const FETCH_DETAIL_NOTIFY_EMAIL = 'fetchDetailNotifyEmail'
export const SEND_NOTIFY_EMAIL = 'sendNotifyEmail'

export const state = {
  notifyEmails: [],
  countNotifyEmails: 0,
  notifyEmail: {},
}

export const mutations = {
  [FETCH_LIST_NOTIFY_EMAIL]: (state, payload) => {
    state.notifyEmails = payload
  },
  [FETCH_DETAIL_NOTIFY_EMAIL]: (state, payload) => {
    state.notifyEmail = payload
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

    if (!list.notifies || !count || list.errorMessage || count.errorMessage) {
      count = { count: 0 }
      result = {
        success: false,
        message: list.errorMessage || count.errorMessage || '',
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

  // eslint-disable-next-line no-unused-vars
  async [FETCH_DETAIL_NOTIFY_EMAIL]({ commit }, payload) {
    let result = { success: true }

    let response = await api.fetchDetailNotifyEmail(payload)
    if (!response || !response.notify) {
      result = {
        success: false,
        message: response.errorMessage,
      }
    }
    commit(FETCH_DETAIL_NOTIFY_EMAIL, response.notify)
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [SEND_NOTIFY_EMAIL]({ commit }, payload) {
    let result = { success: true }

    let response = await api.sendNotifyEmail(payload)
    if (!response || !response.success) {
      result = {
        success: false,
        message: response.errorMessage,
      }
    }
    return result
  },
}
