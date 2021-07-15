import api from '../api'

export const FETCH_LIST_CONTAINERS = 'fetchListContainers'
export const COUNT_LIST_CONTAINERS = 'countListContainers'
export const FETCH_LIST_CONTAINER_BOXES = 'fetchListContainerBoxes'
export const CREATE_CONTAINER = 'createContainer'

export const state = {
  containers: [],
  count: 0,
  count_status: [],
  boxes: [],
}

export const mutations = {
  [FETCH_LIST_CONTAINERS]: (state, payload) => {
    state.containers = payload
  },
  [COUNT_LIST_CONTAINERS]: (state, payload) => {
    state.count = payload.count
    state.count_status = payload.count_status
  },
  [FETCH_LIST_CONTAINER_BOXES]: (state, payload) => {
    state.boxes = payload
  },
}

export const actions = {
  // eslint-disable-next-line no-unused-vars
  async [FETCH_LIST_CONTAINERS]({ commit }, payload) {
    let result = { success: true }

    let [list, count, listBox] = await Promise.all([
      api.fetchListContainers(payload),
      api.countListContainers(payload),
      api.fetchListContainerBoxes(),
    ])

    if (!list.containers || !count || !listBox.boxes) {
      count = { count: 0 }
      result = {
        success: false,
        message: list.errorMessage || '',
      }

      return result
    }
    commit(FETCH_LIST_CONTAINERS, list.containers)
    commit(FETCH_LIST_CONTAINER_BOXES, listBox.boxes)
    commit(COUNT_LIST_CONTAINERS, count)
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async [CREATE_CONTAINER]({ commit }, payload) {
    let result = { success: true }

    let response = await api.createContainer(payload)
    if (!response || !response.container) {
      result = {
        success: false,
        message: response.errorMessage,
      }
    }
    return result
  },
}
