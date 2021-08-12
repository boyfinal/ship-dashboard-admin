export const CONTAINER_WAITING_CLOSE = 1
export const CONTAINER_CLOSE = 2
export const CONTAINER_CANCEL = 3

export const CONTAINER_STATUS_TAB = [
  {
    value: '',
    text: 'Tất cả',
  },
  {
    value: CONTAINER_WAITING_CLOSE,
    text: 'Chờ đóng kiện',
  },
  {
    value: CONTAINER_CLOSE,
    text: 'Đã đóng kiện',
  },
  {
    value: CONTAINER_CANCEL,
    text: 'Đã hủy',
  },
]

export const MAP_NAME_STATUS_CONTAINER = {
  [CONTAINER_WAITING_CLOSE]: {
    value: 'Chờ đóng kiện',
    class: 'badge-await',
  },
  [CONTAINER_CLOSE]: {
    value: 'Đã đóng kiện',
    class: 'badge-success',
  },

  [CONTAINER_CANCEL]: {
    value: 'Đã hủy',
    class: 'badge-danger',
  },
}
