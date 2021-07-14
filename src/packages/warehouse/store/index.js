import api from '../api'

export const FETCH_PACKAGE_DETAIL = 'fetchPackageDetail'

export const state = {
  package: {},
}

export const mutations = {
  [FETCH_PACKAGE_DETAIL]: (state, payload) => {
    state.package = payload
  },
}

export const actions = {
  async [FETCH_PACKAGE_DETAIL]({ commit }, payload) {
    const res = await api.fetchPackage(payload)
    if (!res || res.error) {
      commit(FETCH_PACKAGE_DETAIL, {})
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_PACKAGE_DETAIL, res.package || {})
    return { error: false }
  },
}
