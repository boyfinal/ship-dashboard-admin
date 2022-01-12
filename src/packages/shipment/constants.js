export const ShipmentWaitingClose = 1
export const ShipmentClosed = 2
export const ShipmentCanceled = 3
export const ShipmentDelivered = 4
export const ShipmentIntransit = 5
export const WareHouseStatusActive = 1
export const WareHouseTypeInternational = 1

export const SHIPMENT_STATUS_TAB = [
  {
    value: '',
    text: 'Tất cả',
  },
  {
    value: ShipmentWaitingClose,
    text: 'Đang xử lý',
  },
  {
    value: ShipmentClosed,
    text: 'Đã đóng ',
  },
  {
    value: ShipmentCanceled,
    text: 'Đã hủy',
  },
  {
    value: ShipmentDelivered,
    text: 'Đã giao',
  },
  {
    value: ShipmentIntransit,
    text: 'Đang giao',
  },
]
export const MAP_NAME_STATUS_SHIPMENT = {
  [ShipmentWaitingClose]: {
    value: 'Đang xử lý',
    class: 'badge-await',
  },
  [ShipmentClosed]: {
    value: 'Đã đóng ',
    class: 'badge-success',
  },

  [ShipmentCanceled]: {
    value: 'Đã hủy',
    class: 'badge-danger',
  },
  [ShipmentDelivered]: {
    value: 'Đã giao',
    class: 'badge-info',
  },
  [ShipmentIntransit]: {
    value: 'Đang giao',
    class: 'badge-primary',
  },
}
