export const CONTAINER_WAITING_CLOSE = 1
export const CONTAINER_CLOSE = 2
export const CONTAINER_CANCEL = 3
export const CONTAINER_INTRANSIT = 5
export const CONTAINER_DELIVERIED = 4
export const CONTAINER_IMPORT_HUB = 6
export const CONTAINER_EXPORT_HUB = 7
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
    value: CONTAINER_INTRANSIT,
    text: 'Đang giao',
  },
  {
    value: CONTAINER_DELIVERIED,
    text: 'Đã giao',
  },
  {
    value: CONTAINER_CANCEL,
    text: 'Đã hủy',
  },
  // {
  //   value: CONTAINER_IMPORT_HUB,
  //   text: 'Hub đã nhận',
  // },
  // {
  //   value: CONTAINER_EXPORT_HUB,
  //   text: 'Hub đã xuất',
  // },
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
    text: 'Đã giao ',
  },
  {
    value: CONTAINER_INTRANSIT,
    text: 'Đang giao',
  },
  {
    value: CONTAINER_IMPORT_HUB,
    text: 'Đã giao ',
  },
  {
    value: CONTAINER_EXPORT_HUB,
    text: 'Đã giao ',
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
  [CONTAINER_INTRANSIT]: {
    value: 'Đang giao',
    class: 'badge-primary',
  },
  [CONTAINER_CANCEL]: {
    value: 'Đã hủy',
    class: 'badge-danger',
  },
  [CONTAINER_IMPORT_HUB]: {
    value: 'Đã giao',
    class: 'badge-import-hub',
  },
  [CONTAINER_EXPORT_HUB]: {
    value: 'Đã giao',
    class: 'badge-export-hub',
  },
}
export const MAP_NAME_STATUS_CONTAINER_HUB = {
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
  [CONTAINER_INTRANSIT]: {
    value: 'Đang giao',
    class: 'badge-primary',
  },
  [CONTAINER_CANCEL]: {
    value: 'Đã hủy',
    class: 'badge-danger',
  },
  [CONTAINER_IMPORT_HUB]: {
    value: 'Hub đã nhận',
    class: 'badge-import-hub',
  },
  [CONTAINER_EXPORT_HUB]: {
    value: 'Hub đã xuất',
    class: 'badge-export-hub',
  },
}
