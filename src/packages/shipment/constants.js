export const ShipmentWaitingClose = 1
export const ShipmentClosed = 2
export const ShipmentCanceled = 3

export const WareHouseStatusActive = 1
export const WareHouseTypeInternational = 1

export const SHIPMENT_STATUS_TAB = [
  {
    value: '',
    text: 'Tất cả',
  },
  {
    value: ShipmentWaitingClose,
    text: 'Chờ đóng lô',
  },
  {
    value: ShipmentClosed,
    text: 'Đã đóng lô',
  },
  {
    value: ShipmentCanceled,
    text: 'Đã hủy',
  },
]
export const MAP_NAME_STATUS_SHIPMENT = {
  [ShipmentWaitingClose]: {
    value: 'Chờ đóng lô',
    class: 'badge-await',
  },
  [ShipmentClosed]: {
    value: 'Đã đóng lô',
    class: 'badge-success',
  },

  [ShipmentCanceled]: {
    value: 'Đã hủy',
    class: 'badge-danger',
  },
}
