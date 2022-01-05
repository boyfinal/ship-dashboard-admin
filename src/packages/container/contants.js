export const CONTAINER_WAITING_CLOSE = 1
export const CONTAINER_CLOSE = 2
export const CONTAINER_CANCEL = 3
export const CONTAINER_DELIVERIED = 4
export const CONTAINER_STATUS_TAB = [
  {
    value: '',
    text: 'Tất cả',
  },
  {
    value: CONTAINER_WAITING_CLOSE,
    text: 'Đang xử lý',
  },
  {
    value: CONTAINER_CLOSE,
    text: 'Đã đóng',
  },
  {
    value: CONTAINER_DELIVERIED,
    text: 'Đã giao',
  },
  {
    value: CONTAINER_CANCEL,
    text: 'Đã hủy',
  },
]

export const MAP_TEXT_STATUS_CONTAINER = [
  {
    value: '',
    text: '-',
  },
  {
    value: CONTAINER_WAITING_CLOSE,
    text: 'Đang xử lý',
  },
  {
    value: CONTAINER_CLOSE,
    text: 'Đã đóng ',
  },
  {
    value: CONTAINER_CANCEL,
    text: 'Đã hủy',
  },
  {
    value: CONTAINER_DELIVERIED,
    text: 'Đã chuyển ',
  },
]

export const MAP_NAME_STATUS_CONTAINER = {
  [CONTAINER_WAITING_CLOSE]: {
    value: 'Đang xử lý',
    class: 'badge-await',
  },
  [CONTAINER_CLOSE]: {
    value: 'Đã đóng ',
    class: 'badge-success',
  },
  [CONTAINER_DELIVERIED]: {
    value: 'Đã giao',
    class: 'badge-info',
  },
  [CONTAINER_CANCEL]: {
    value: 'Đã hủy',
    class: 'badge-danger',
  },
}
