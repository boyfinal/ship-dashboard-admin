import api from '../api'

/**
 * Type
 */
export const LIST_USER = 'listUser'
export const COUNT_USER = 'countUser'
export const CREATE_USER = 'createUser'
export const UPDATE_STATUS_USER = 'updateStatusUser'
export const UPDATE_ROLE_USER = 'updateRoleUser'
/**
 * State
 */
export const state = {
  user: {},
  users: [],
  count_user: 0,
}

/**
 * Mutation
 */
export const mutations = {
  [LIST_USER]: (state, payload) => {
    state.users = payload
  },
  [COUNT_USER]: (state, payload) => {
    state.count_user = payload
  },
}

/**
 * Actions
 */
export const actions = {
  // eslint-disable-next-line no-unused-vars
  async updateStatusUser({ commit }, payload) {
    const res = await api.updateStatusUser(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    return { error: false }
  },

  // eslint-disable-next-line no-unused-vars
  async updateRoleUser({ commit }, payload) {
    const res = await api.updateRoleUser(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    return { error: false }
  },

  async listUser({ commit }, payload) {
    let success = true
    let message = ''

    let [list, count] = await Promise.all([
      api.listUsers(payload),
      api.countUsers(payload),
    ])
    if (!list || list.error || !count) {
      success = false
      message = list.errorMessage || ''
      list = []
      count = 0
    }

    commit(LIST_USER, list.users)
    commit(COUNT_USER, count.count)
    return { success, message }
  },

  /**
   * Create sender
   * @param commit
   * @param payload
   */
  // eslint-disable-next-line
  async createUser({ commit }, payload) {
    const response = await api.createUser(payload)

    if (response && response.success) {
      return { success: true }
    }

    return {
      success: false,
      message: response.errorMessage || '',
    }
  },
}
