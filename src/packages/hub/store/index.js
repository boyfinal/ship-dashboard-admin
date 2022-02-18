import api from '../api'

export const GET_CONTAINER_IMPORT = 'getContainerImport'
export const FETCH_LIST_CONTAINER_IMPORTED = 'fetchListContainerImported'
export const COUNT_LIST_CONTAINER_IMPORTED = 'countListContainerImported'
export const COUNT_PACKAGE_CONTAINER_IMPORT = 'countPackageContainerImport'
export const SCAN_CONTAINER_IMPORT = 'scanContainerImport'
export const FETCH_LIST_IMPORTED = 'fetchListImported'
export const COUNT_LIST_IMPORTED = 'countListImported'
export const GET_IMPORT_HUB_DETAIL = 'getImportHubDetail'
export const SCAN_EXPORT_HUB = 'scanExportHub'

export const state = {
  container: {},
  countPackages: 0,
  containers: [],
  count: 0,
  listImported: [],
  coutListImported: 0,
  importHubDetail: {},
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
  [FETCH_LIST_IMPORTED]: (state, payload) => {
    state.listImported = payload
  },
  [COUNT_LIST_IMPORTED]: (state, payload) => {
    state.coutListImported = payload
  },
  [GET_IMPORT_HUB_DETAIL]: (state, payload) => {
    state.importHubDetail = payload
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

  // eslint-disable-next-line no-unused-vars
  async [FETCH_LIST_IMPORTED]({ commit }, payload) {
    let result = { success: true }

    let res = await api.fetchListImported(payload)

    if (!res.codes || !res.count) {
      res.count = 0
      result = {
        success: false,
        message: res.errorMessage || '',
      }

      return result
    }

    commit(FETCH_LIST_IMPORTED, res.codes)
    commit(COUNT_LIST_IMPORTED, res.count)
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [GET_IMPORT_HUB_DETAIL]({ commit }, payload) {
    let result = { success: true }

    let response = await api.getImportHubDetail(payload)
    if (
      (!response || !response.container || !response.container_count) &&
      (!response || !response.package)
    ) {
      result = {
        success: false,
        message: response.errorMessage,
      }
      return result
    }
    commit(
      GET_IMPORT_HUB_DETAIL,
      response.container ? response.container : response.package
    )
    if (response.container_count > 0) {
      commit(COUNT_PACKAGE_CONTAINER_IMPORT, response.container_count)
    }

    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [SCAN_EXPORT_HUB]({ commit }, payload) {
    let result = { success: true }

    let response = await api.scanExportHub(payload)
    if (!response || !response.success) {
      result = {
        success: false,
        message: response.errorMessage,
      }
    }
    return result
  },
}
