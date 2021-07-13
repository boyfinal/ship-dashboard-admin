import api from '../api'

export const FETCH_LIST_CONTAINERS = 'fetchListContainers'
export const COUNT_LIST_CONTAINERS = 'countListContainers'

export const state = {
  containers: [],
  count: 0,
  count_status: [],
}

export const mutations = {
  [FETCH_LIST_CONTAINERS]: (state, payload) => {
    state.containers = payload
  },
  [COUNT_LIST_CONTAINERS]: (state, payload) => {
    state.count = payload.count
    state.count_status = payload.count_status
  },
}

export const actions = {
  // eslint-disable-next-line no-unused-vars
  async [FETCH_LIST_CONTAINERS]({ commit }, payload) {
    let result = { success: true }
    let [list, count] = await Promise.all([
      api.fetchListContainers(payload),
      api.countListContainers(payload),
    ])
    if (!list.containers || !count) {
      count = { count: 0 }
      result = {
        success: false,
        message: list.errorMessage || '',
      }

      return result
    }
    commit(FETCH_LIST_CONTAINERS, list.containers)
    commit(COUNT_LIST_CONTAINERS, count)
    return result
  },
}
