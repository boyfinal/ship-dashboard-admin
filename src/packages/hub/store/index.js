import api from '../api'

export const GET_CONTAINER_IMPORT = 'getContainerImport'
export const FETCH_LIST_CONTAINER_IMPORTED = 'fetchListContainerImported'
export const COUNT_LIST_CONTAINER_IMPORTED = 'countListContainerImported'
export const COUNT_PACKAGE_CONTAINER_IMPORT = 'countPackageContainerImport'
export const SCAN_CONTAINER_IMPORT = 'scanContainerImport'
export const state = {
  container: {},
  countPackages: 0,
  containers: [],
  count: 0,
}

export const mutations = {
  [GET_CONTAINER_IMPORT]: (state, payload) => {
    state.container = payload
  },
  [FETCH_LIST_CONTAINER_IMPORTED]: (state, payload) => {
    state.containers = payload
  },
  [COUNT_LIST_CONTAINER_IMPORTED]: (state, payload) => {
    state.count = payload
  },
  [COUNT_PACKAGE_CONTAINER_IMPORT]: (state, payload) => {
    state.countPackages = payload
  },
}

export const actions = {
  // eslint-disable-next-line no-unused-vars
  async [GET_CONTAINER_IMPORT]({ commit }, payload) {
    let result = { success: true }

    let response = await api.getContainerImport(payload)
    if (!response || !response.container || !response.container_count) {
      result = {
        success: false,
        message: response.errorMessage,
      }
      return result
    }
    commit(GET_CONTAINER_IMPORT, response.container)
    commit(COUNT_PACKAGE_CONTAINER_IMPORT, response.container_count)
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async [FETCH_LIST_CONTAINER_IMPORTED]({ commit }, payload) {
    let result = { success: true }

    let [list, count] = await Promise.all([
      api.fetchListContainerImported(payload),
      api.countListContainerImported(payload),
    ])

    if (!list.containers || !count) {
      count = { count: 0 }
      result = {
        success: false,
        message: list.errorMessage || '',
      }

      return result
    }
    commit(FETCH_LIST_CONTAINER_IMPORTED, list.containers)
    commit(COUNT_LIST_CONTAINER_IMPORTED, count)
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [SCAN_CONTAINER_IMPORT]({ commit }, payload) {
    let result = { success: true }

    let response = await api.scanContainerImport(payload)
    if (!response || !response.success) {
      result = {
        success: false,
        message: response.errorMessage,
      }
    }
    return result
  },
}
