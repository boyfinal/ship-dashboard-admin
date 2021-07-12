import api from '../api'
export const FETCH_BILL_DETAIL = 'fetchBillDetail'
export const FETCH_BILL_EXTRA = 'fetchBillExtra'
export const COUNT_FEE_CREATE = 'countFeeCreate'
export const FETCH_FEE_CREATE = 'fetchFeeCreate'
export const COUNT_FEE_EXTRA = 'countFeeExtra'
export const FETCH_FEE_EXTRA = 'fetchFeeExtra'
export const state = {
  bill: {},
  feeEdit: [],
  feeCreate: [],
  feeExtra: [],
  countEdit: 0,
  countCreate: 0,
  countExtra: 0,
}

export const mutations = {
  [FETCH_BILL_DETAIL]: (state, payload) => {
    state.bill = payload
  },
  [COUNT_FEE_CREATE]: (state, payload) => {
    state.countCreate = payload
  },
  [FETCH_FEE_CREATE]: (state, payload) => {
    state.feeCreate = payload
  },
  [COUNT_FEE_EXTRA]: (state, payload) => {
    state.countExtra = payload
  },
  [FETCH_FEE_EXTRA]: (state, payload) => {
    state.feeExtra = payload
  },
}

export const actions = {
  async fetchBillDetail({ commit }, payload) {
    const res = await api.fetchBillDetail(payload)
    if (!res || res.error) {
      return { success: false, message: res.errorMessage || '' }
    }
    commit(FETCH_FEE_CREATE, res.bill.package)
    commit(FETCH_BILL_DETAIL, res.bill)
    commit(COUNT_FEE_CREATE, res.count_package)

    return {
      success: true,
      total: res.total_fee,
      total_unpaid: res.total_unpaid,
    }
  },
  async fetchBillExtra({ commit }, payload) {
    const res = await api.fetchExtraFee(payload)
    if (!res || res.error) {
      return { success: false, message: res.errorMessage || '' }
    }

    commit(FETCH_FEE_EXTRA, res.fees)
    commit(COUNT_FEE_EXTRA, res.count)

    return { success: true }
  },
}
