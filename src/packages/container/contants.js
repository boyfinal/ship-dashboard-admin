export const ContainerWaitingClose = 1
export const ContainerClosed = 2
export const ContainerCanceled = 3

export const CONTAINER_STATUS_TAB = [
  {
    value: '',
    text: 'Tất cả',
  },
  {
    value: ContainerWaitingClose,
    text: 'Chờ đóng kiện',
  },
  {
    value: ContainerClosed,
    text: 'Đã đóng kiện',
  },
  {
    value: ContainerCanceled,
    text: 'Đã hủy',
  },
]

export const MAP_NAME_STATUS_CONTAINER = {
  [ContainerWaitingClose]: {
    value: 'Chờ đóng kiện',
    class: 'badge-await',
  },
  [ContainerClosed]: {
    value: 'Đã đóng kiện',
    class: 'badge-success',
  },

  [ContainerCanceled]: {
    value: 'Đã hủy',
    class: 'badge-danger',
  },
}
