import Vue from 'vue'
import { domOn } from '../utils/dom'
import { capitalize } from '@core/utils/string'

const nodeList = []
const ctx = '@@clickoutsideContext'

let startClick
let seed = 0

!Vue.prototype.$isServer &&
  domOn(document, 'mousedown', (e) => (startClick = e))

!Vue.prototype.$isServer &&
  domOn(document, 'mouseup', (e) => {
    nodeList.forEach((node) => node[ctx].documentHandler(e, startClick))
  })

function createDocumentHandler(el, binding, vnode) {
  return function(mouseup = {}, mousedown = {}) {
    if (
      !vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      (vnode.context.popperElm &&
        (vnode.context.popperElm.contains(mouseup.target) ||
          vnode.context.popperElm.contains(mousedown.target)))
    )
      return

    if (
      binding.expression &&
      el[ctx].methodName &&
      vnode.context[el[ctx].methodName]
    ) {
      vnode.context[el[ctx].methodName]()
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn()
    }
  }
}

/**
 * v-clickoutside
 */
export const clickoutside = {
  bind(el, binding, vnode) {
    nodeList.push(el)
    const id = seed++
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value,
    }
  },

  update(el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode)
    el[ctx].methodName = binding.expression
    el[ctx].bindingFn = binding.value
  },

  unbind(el) {
    let len = nodeList.length

    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1)
        break
      }
    }
    delete el[ctx]
  },
}

const getFormatStatus = (status) => {
  let statusClass = ''
  switch (status) {
    case 'draft':
    case 'awaiting':
    case 'in-Transit':
      statusClass = 'default'
      break
    case 'process':
    case 'active':
    case 'balance':
      statusClass = 'success'
      break
    case 'feedback':
    case 'fulfilled':
    case 'fulfill':
      statusClass = 'primary'
      break
    case 'open':
    case 'in-review':
      statusClass = 'info'
      break

    case 'inactive':
    case 'rejected':
    case 'withdrew':
    case 'canceled':
      statusClass = 'danger'
      break
    case 'closed':
      statusClass = 'dark'
      break
    case 'Hết hạn':
    case 'expired':
      statusClass = 'expired'
      break
    case 'confirm payment':
    case 'unpaid':
    case 'Pre-Transit':
      statusClass = 'pending'
      break
    case 'partially paid':
      statusClass = 'partially-paid'
      break
    case 'paid':
      statusClass = 'paid'
      break
    case 'awaiting payment':
      statusClass = 'awaiting-payment'
      break
    case 'debt':
      statusClass = 'debt'
      break
    case 'cancel':
      statusClass = 'cancel'
      break
    case 'done':
      statusClass = 'done'
      break
    case 'resolved':
      statusClass = 'resolved'
      break
    case 'Tạo mới':
    case 'Kiểm hàng':
      statusClass = 'default'
      break
    case 'Chờ lấy':
    case 'pending':
      statusClass = 'await'
      break
    case 'Đã lấy':
    case 'Đã dán nhãn':
    case 'Đang giao':
    case 'processing':
    case 'Processing':
      statusClass = 'primary'
      break
    case 'Giao thành công':
    case 'Thành công':
    case 'Xuất kho':
    case 'delivered':
      statusClass = 'success'
      break
    case 'Trả hàng':
      statusClass = 'info'
      break
    case 'Hủy':
    case 'Đã hủy':
    case 'Thất bại':
    case 'Từ chối':
      statusClass = 'danger'
      break
    case 'Đang xử lý':
    case 'Chờ xác nhận':
      statusClass = 'pending'
      break
    case 'Đã xử lý':
    case 'Đóng lô':
      statusClass = 'done'
      break
    case 'Chưa thanh toán':
    case 'Đóng kiện':
      statusClass = 'unpaid'
      break
    case 'Hoàn tiền':
      statusClass = 'refund'
      break
    case 'alert':
    case 'Alert':
      statusClass = 'alert'
      break
    case 'import-hub':
    case 'Hub đã nhận':
      statusClass = 'import-hub'
      break
    case 'export-hub':
    case 'Hub đã xuất':
      statusClass = 'export-hub'
      break
  }

  return {
    text: capitalize(status),
    classList: `badge badge-round badge-${statusClass}`,
  }
}

export const labelStatus = {
  update(el, binding) {
    const { text, classList } = getFormatStatus(binding.value)
    el.classList = classList
    el.innerText = text
  },
  inserted(el, binding) {
    const { text, classList } = getFormatStatus(binding.value)
    el.classList = classList
    el.innerText = text
  },
}

const initGlobalDirectives = () => {
  Vue.directive('status', labelStatus)
}

export default initGlobalDirectives
