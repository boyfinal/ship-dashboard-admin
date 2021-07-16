export const PACKAGE_WAREHOUSE_STATUS_PICK = 10
export const PACKAGE_STATUS_WAREHOUSE_LABELED = 11
export const PACKAGE_WAREHOUSE_STATUS_IN_CONTAINER = 12
export const PACKAGE_WAREHOUSE_STATUS_IN_SHIPMENT = 13
export const PACKAGE_WAREHOUSE_STATUS_EXPORT = 14
export const PACKAGE_WAREHOUSE_STATUS_RETURN = 40
export const PACKAGE_WAREHOUSE_STATUS_CANCELLED = 50
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
    value: PACKAGE_WAREHOUSE_STATUS_EXPORT,
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

export const MAP_NAME_STATUS_PACKAGE = {
  [PACKAGE_WAREHOUSE_STATUS_PICK]: {
    value: 'Đã lấy',
    class: 'badge-primary',
  },
  [PACKAGE_STATUS_WAREHOUSE_LABELED]: {
    value: 'Kiểm hàng',
    class: 'badge-success',
  },
  [PACKAGE_WAREHOUSE_STATUS_IN_CONTAINER]: {
    value: 'Đóng kiện',
    class: 'badge-success',
  },
  [PACKAGE_WAREHOUSE_STATUS_IN_SHIPMENT]: {
    value: 'Đóng lô',
    class: 'badge-success',
  },
  [PACKAGE_WAREHOUSE_STATUS_EXPORT]: {
    value: 'Xuất kho',
    class: 'badge-success',
  },
  [PACKAGE_WAREHOUSE_STATUS_RETURN]: {
    value: 'Trả hàng',
    class: 'badge-warning',
  },
  [PACKAGE_WAREHOUSE_STATUS_CANCELLED]: {
    value: 'Hủy',
    class: 'badge-danger',
  },
}
