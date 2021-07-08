import api from '../api'
export const UPLOAD_FILE_CLAIM = 'uploadFileClaim'
export const COUNT_CLAIMS = 'countClaims'
export const COUNT_CLAIMS_BY_STATUS = 'countClaimsByStatus'
export const FETCH_CLAIMS = 'fetchClaims'
export const CREATE_CLAIM = 'createClaim'
export const FETCH_TICKET = 'fetchTicket'
export const UPDATE_TICKET = 'updateTicket'
export const UPDATE_FILE_TICKET = 'updateFileTicket'
export const CANCEL_TICKET = 'cancelTicket'
export const FETCH_MESSAGE = 'fetchMessage'
export const COUNT_MESSAGE = 'countMessage'
export const GET_FILE_TICKET = 'getFileTicket'
export const UPDATE_MESSAGE_TICKET = 'updateTicketMessage'
export const PUSH_MESSAGE = 'pushMessage'
export const APPEND_MESSAGE = 'appendMessage'
export const SET_MESSAGES = 'setMessages'
export const state = {
  claims: [],
  count: 0,
  ticket: {},
  message: [],
  countMess: 0,
  totalCount: [],
}
export const mutations = {
  [FETCH_CLAIMS]: (state, payload) => {
    state.claims = payload
  },
  [COUNT_CLAIMS]: (state, payload) => {
    state.count = payload
  },
  [FETCH_TICKET]: (state, payload) => {
    state.ticket = payload.ticket
  },
  [UPDATE_TICKET]: (state, payload) => {
    state.ticket = payload.ticket
  },
  [FETCH_MESSAGE]: (state, payload) => {
    state.message = payload || []
  },
  [COUNT_MESSAGE]: (state, payload) => {
    state.countMess = payload
  },
  [UPDATE_MESSAGE_TICKET]: (state, payload) => {
    state.message = payload
  },
  [PUSH_MESSAGE]: (state, payload) => {
    state.message = [payload, ...state.message]
  },
  [APPEND_MESSAGE]: (state, payload) => {
    state.message.push(...payload)
  },
  [SET_MESSAGES]: (state) => {
    state.message = []
  },
  [COUNT_CLAIMS_BY_STATUS]: (state, payload) => {
    state.totalCount = payload
  },
}

export const actions = {
  // eslint-disable-next-line
  async uploadFileClaim({ commit }, payload) {
    let res = await api.uploadFileTicket(payload)

    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }
    return { error: false, urls: res.url }
  },

  async [FETCH_CLAIMS]({ commit }, payload) {
    const [res, count, totalCount] = await Promise.all([
      api.fetchClaim(payload),
      api.countClaim(payload),
      api.countClaimByStatus(payload),
    ])
    if (!res || res.error || count.error) {
      return { error: true, message: res.errorMessage || '' }
    }
    commit(FETCH_CLAIMS, res.tickets)
    commit(COUNT_CLAIMS, count.count)
    commit(COUNT_CLAIMS_BY_STATUS, totalCount.result)

    return { error: false }
  },

  /**
   * Creat Claim
   * @param commit
   * @param payload
   * @returns {Promise<{success: boolean}>}
   */
  // eslint-disable-next-line
  async createClaim({ commit }, payload) {
    let response

    response = await api.createClaim(payload)
    if (response && response.ticket) {
      return { error: false }
    }
    return { error: true, message: response.errorMessage || '' }
  },

  async [FETCH_TICKET]({ commit }, payload) {
    const res = await api.fetchTicket(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }
    commit(FETCH_TICKET, res)
    return {
      error: false,
      status: res.ticket.status,
      id: res.ticket.id,
      // create_at:res.ticket.create_at
    }
  },
  // eslint-disable-next-line no-unused-vars
  async updateTicket({ commit }, payload) {
    const res = await api.updateTicket(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }
    commit(UPDATE_TICKET, res)
    commit(FETCH_TICKET, res)
    return {
      error: false,
    }
  },
  // eslint-disable-next-line
  async updateFileTicket({ commit }, payload) {
    let res = await api.updateFileTicket(payload)

    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }
    return { error: false, urls: res.url }
  },
  // eslint-disable-next-line
  async [CANCEL_TICKET]({ commit }, payload) {
    const res = await api.cancelTicket(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }
    return { error: false }
  },
  async [FETCH_MESSAGE]({ commit }, payload) {
    const [res, count] = await Promise.all([
      api.fetchMessageTickets(payload),
      api.countMessage(payload),
    ])
    if (!res || res.error || count.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    commit(APPEND_MESSAGE, res.messages)
    commit(COUNT_MESSAGE, count.count)
    return { error: false, ...res }
  },

  // eslint-disable-next-line no-empty-pattern
  async getFileTicket({}, payload) {
    let result = { success: true }
    let response = await api.fetchTicketFile(payload)

    if (!response || response.error) {
      result = {
        success: false,
        message: response.errorMessage || '',
      }
    }
    result.blob = response
    return result
  },

  async [PUSH_MESSAGE]({ commit }, payload) {
    const res = await api.reply(payload.ticket_id, payload)
    if (!res || res.error) {
      return { success: false, message: res.errorMessage || '' }
    }

    commit(PUSH_MESSAGE, res.message)
    return { success: true, reply: res.message }
  },
}
