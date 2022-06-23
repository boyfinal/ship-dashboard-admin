import api from '../api'

export const FETCH_LIST_CONTAINERS = 'fetchListContainers'
export const FETCH_LIST_CONTAINERS_NO_BOX = 'fetchListContainersNoBox'
export const COUNT_LIST_CONTAINERS = 'countListContainers'
export const FETCH_LIST_CONTAINER_BOXES = 'fetchListContainerBoxes'
export const CREATE_CONTAINER = 'createContainer'
export const APPEND_PACKAGE_TO_CONTAINER = 'appendPackageToContainer'
export const FETCH_CONTAINER_DETAIL = 'fetchContainerDetail'
export const REMOVE_PACKAGE_FROM_CONTAINER = 'removePackageFromContainer'
export const CLOSE_CONTAINER = 'closeContainer'
export const CANCEL_CONTAINER = 'cancelContainer'
export const GET_LABEL = 'getLabel'

export const state = {
  containers: [],
  container_detail: {},
  count_packages_in_container: 0,
  packages_in_container: [],
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
  [FETCH_CONTAINER_DETAIL]: (state, payload) => {
    state.container_detail = payload.container
    state.count_packages_in_container = payload.container_count
    state.packages_in_container = payload.packages
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
    }
    commit(FETCH_LIST_CONTAINERS, list.containers)
    commit(COUNT_LIST_CONTAINERS, count)
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [FETCH_LIST_CONTAINERS_NO_BOX]({ commit }, payload) {
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

  // eslint-disable-next-line no-unused-vars
  async [FETCH_CONTAINER_DETAIL]({ commit }, payload) {
    let result = { success: true }
    let [list, listBox] = await Promise.all([
      api.detailContainer(payload),
      api.fetchListContainerBoxes(),
    ])
    if (!list || !list.container || !listBox) {
      result = {
        success: false,
        message: list.errorMessage,
      }
    }

    commit(FETCH_CONTAINER_DETAIL, list)
    commit(FETCH_LIST_CONTAINER_BOXES, listBox.boxes)

    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [APPEND_PACKAGE_TO_CONTAINER]({ commit }, payload) {
    let result = { success: true }

    let response = await api.appendPackage(payload)
    if (!response || !response.success) {
      result = {
        success: false,
        message: response.errorMessage,
      }
    }
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [REMOVE_PACKAGE_FROM_CONTAINER]({ commit }, payload) {
    let result = { success: true }

    let response = await api.removePackage(payload)
    if (!response || !response.success) {
      result = {
        success: false,
        message: response.errorMessage,
      }
    }
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [CLOSE_CONTAINER]({ commit }, payload) {
    let result = { success: true }

    let response = await api.closeContainer(payload)
    if (!response || !response.success) {
      result = {
        success: false,
        message: response.errorMessage,
      }
    }
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [CANCEL_CONTAINER]({ commit }, payload) {
    let result = { success: true }

    let response = await api.cancelContainer(payload)
    if (!response || !response.success) {
      result = {
        success: false,
        message: response.errorMessage,
      }
    }
    return result
  },

  // eslint-disable-next-line no-empty-pattern
  async getLabel({}, payload) {
    let result = { success: true }
    let response = await api.downloadLabel(payload)

    if (!response || response.error) {
      result = {
        success: false,
        message: response.errorMessage || '',
      }
    }
    result.blob = response
    return result
  },
}
