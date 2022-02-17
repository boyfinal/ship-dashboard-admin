import { SERVER_ERROR_MESSAGE } from '@/core/constants/http'
import api from '../api'

export const HUB_SEARCH_ITEMS = 'searchItems'
export const HUB_COUNT_SEARCH_ITEMS = 'countSearchItems'
export const HUB_RETURN = 'return'
export const FETCH_PACKAGE_DETAIL = 'fetchPackageDetail'

export const state = {
  items: [],
  count: 0,
  package: {},
}

export const mutations = {
  [HUB_SEARCH_ITEMS]: (state, items) => {
    state.items = items
  },
  [HUB_COUNT_SEARCH_ITEMS]: (state, count) => {
    state.count = count
  },
  [FETCH_PACKAGE_DETAIL]: (state, payload) => {
    state.package = payload
  },
}

export const actions = {
  async [HUB_SEARCH_ITEMS]({ commit }, payload) {
    commit(HUB_SEARCH_ITEMS, [])

    const res = await api.search(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || SERVER_ERROR_MESSAGE }
    }

    commit(HUB_SEARCH_ITEMS, res.items)
    return { error: false }
  },

  async [HUB_COUNT_SEARCH_ITEMS]({ commit }, payload) {
    commit(HUB_COUNT_SEARCH_ITEMS, 0)

    const res = await api.countSearch(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || SERVER_ERROR_MESSAGE }
    }

    commit(HUB_COUNT_SEARCH_ITEMS, res.count)
    return { error: false }
  },

  // eslint-disable-next-line
  async [HUB_RETURN]({ commit }, payload) {
    const res = await api.return(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || SERVER_ERROR_MESSAGE }
    }

    return { error: false }
  },

  async [FETCH_PACKAGE_DETAIL]({ commit }, packageId) {
    commit(FETCH_PACKAGE_DETAIL, {})

    const res = await api.fetchPackageDetail(packageId)
    if (!res || res.error) {
      return {
        error: true,
        message: res.errorMessage || SERVER_ERROR_MESSAGE,
        package: {},
      }
    }

    commit(FETCH_PACKAGE_DETAIL, res.package)
    return { error: false, package: res.package }
  },
}
