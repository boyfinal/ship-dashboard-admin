export const PACKAGE_STATUS_CREATED = 1
export const PACKAGE_STATUS_PENDING_PICKUP = 2
export const PACKAGE_WAREHOUSE_STATUS_PICK = 10
export const PACKAGE_STATUS_WAREHOUSE_LABELED = 11
export const PACKAGE_WAREHOUSE_STATUS_IN_CONTAINER = 12
export const PACKAGE_WAREHOUSE_STATUS_IN_SHIPMENT = 13
export const PACKAGE_WAREHOUSE_STATUS_EXPORT = 14
export const PACKAGE_WAREHOUSE_STATUS_INTRANSIT = 30
export const PACKAGE_WAREHOUSE_STATUS_RETURN = 40
export const PACKAGE_WAREHOUSE_STATUS_CANCELLED = 50
export const PACKAGE_STATUS_DELIVERED = 60
export const PACKAGE_WAREHOUSE_EXPIRED = 70

export const PACKAGE_IN_WAREHOUSE_STATUS_TAB = [
  {
    value: '',
    text: 'Tất cả',
  },
  {
    value: PACKAGE_WAREHOUSE_STATUS_PICK,
    text: 'Đã lấy',
  },
  {
    value: PACKAGE_STATUS_WAREHOUSE_LABELED,
    text: 'Kiểm hàng',
  },
  {
    value: PACKAGE_WAREHOUSE_STATUS_IN_CONTAINER,
    text: 'Đóng kiện',
  },
  {
    value: PACKAGE_WAREHOUSE_STATUS_IN_SHIPMENT,
    text: 'Đóng lô',
  },
  {
    value: PACKAGE_WAREHOUSE_STATUS_INTRANSIT,
    text: 'Xuất kho',
  },
  {
    value: PACKAGE_WAREHOUSE_STATUS_RETURN,
    text: 'Trả hàng',
  },
  {
    value: PACKAGE_WAREHOUSE_STATUS_CANCELLED,
    text: 'Hủy',
  },
]

export const PACKAGES_STATUS_TEXT = {
  [PACKAGE_WAREHOUSE_STATUS_PICK]: 'Đã lấy',
  [PACKAGE_STATUS_WAREHOUSE_LABELED]: 'Kiểm hàng',
  [PACKAGE_WAREHOUSE_STATUS_IN_CONTAINER]: 'Đóng kiện',
  [PACKAGE_WAREHOUSE_STATUS_IN_SHIPMENT]: 'Đóng lô',
  [PACKAGE_WAREHOUSE_STATUS_INTRANSIT]: 'Xuất kho',
  [PACKAGE_WAREHOUSE_STATUS_RETURN]: 'Trả hàng',
  [PACKAGE_WAREHOUSE_STATUS_CANCELLED]: 'Hủy',
}

export const EXPORT_HUB_TAB = [
  {
    value: 'container',
    text: 'Kiện hàng',
  },
  {
    value: 'package',
    text: 'Đơn hàng',
  },
]
