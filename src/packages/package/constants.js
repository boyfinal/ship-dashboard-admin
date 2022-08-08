export const PRODUCT_STATUS_ACTIVATE = 1
export const PACKAGE_STATUS_DEACTIVATE = 0
export const PACKAGE_CODE_TEMP = 2
export const PACKAGE_STATUS_CREATED = 1
export const PACKAGE_STATUS_PENDING_PICKUP = 2
export const PACKAGE_STATUS_RE_PENDING_PICKUP = 3
export const PACKAGE_STATUS_PICKED = 10
export const PACKAGE_STATUS_WAREHOUSE_LABELED = 11
export const PACKAGE_STATUS_WAREHOUSE_IN_CONTAINER = 12
export const PACKAGE_STATUS_WAREHOUSE_IN_SHIPMENT = 13
export const PACKAGE_STATUS_WAREHOUSE_EXPORT = 14
export const PACKAGE_STATUS_IMPORT_HUB = 15
export const PACKAGE_STATUS_EXPORT_HUB = 16
export const PACKAGE_STATUS_IN_TRANSIT = 30
export const PACKAGE_STATUS_DELIVERED = 60
export const PACKAGE_STATUS_RETURNED = 40
export const PACKAGE_STATUS_CANCELLED = 50
export const PACKAGE_STATUS_EXPIRED = 70
export const PACKAGE_STATUS_RESHIP = 80
export const PACKAGE_STATUS_UNDELIVERED = 90
export const PACKAGE_STATUS_ARCHIVED = 55

export const PACKAGE_STATUS_CREATED_TEXT = 'pending'
export const PACKAGE_STATUS_PENDING_PICKUP_TEXT = 'pre-transit'
export const PACKAGE_STATUS_PROCESSING_TEXT = 'processing'
export const PACKAGE_STATUS_IN_TRANSIT_TEXT = 'in-transit'
export const PACKAGE_STATUS_IMPORT_HUB_TEXT = 'import-hub'
export const PACKAGE_STATUS_EXPORT_HUB_TEXT = 'export-hub'
export const PACKAGE_STATUS_DELIVERED_TEXT = 'delivered'
export const PACKAGE_STATUS_ALERT_TEXT = 'alert'
export const PACKAGE_STATUS_CANCELLED_TEXT = 'canceled'
export const PACKAGE_STATUS_EXPIRED_TEXT = 'expired'
export const PACKAGE_STATUS_UNDELIVERED_TEXT = 'undelivered'
export const PACKAGE_STATUS_ARCHIVED_TEXT = 'archived'

export const PACKAGE_ALERT_TYPE_OVER_PRE_TRANSIT = 1
export const PACKAGE_ALERT_TYPE_WAREHOUSE_RETURN = 2
export const PACKAGE_ALERT_TYPE_HUB_RETURN = 3

export const PACKAGE_STATUS_TAB = [
  {
    value: '',
    text: 'All',
  },
  {
    value: PACKAGE_STATUS_CREATED_TEXT,
    text: 'Pending',
  },
  {
    value: PACKAGE_STATUS_PENDING_PICKUP_TEXT,
    text: 'Pre-Transit',
  },
  {
    value: PACKAGE_STATUS_PROCESSING_TEXT,
    text: 'Processing',
  },
  {
    value: PACKAGE_STATUS_IN_TRANSIT_TEXT,
    text: 'In-Transit',
  },
  {
    value: PACKAGE_STATUS_DELIVERED_TEXT,
    text: 'Delivered',
  },
  {
    value: PACKAGE_STATUS_ALERT_TEXT,
    text: 'Alert',
  },
  {
    value: PACKAGE_STATUS_CANCELLED_TEXT,
    text: 'Canceled',
  },
  {
    value: PACKAGE_STATUS_EXPIRED_TEXT,
    text: 'Expired',
  },
  {
    value: PACKAGE_STATUS_UNDELIVERED_TEXT,
    text: 'Undelivered',
  },
  {
    value: PACKAGE_STATUS_ARCHIVED_TEXT,
    text: 'Archive',
  },
]

export const MAP_PACKAGE_STATUS_TEXT = {
  [PACKAGE_STATUS_CREATED]: PACKAGE_STATUS_CREATED_TEXT,
  [PACKAGE_STATUS_PENDING_PICKUP]: PACKAGE_STATUS_PENDING_PICKUP_TEXT,
  [PACKAGE_STATUS_PICKED]: PACKAGE_STATUS_PROCESSING_TEXT,
  [PACKAGE_STATUS_WAREHOUSE_LABELED]: PACKAGE_STATUS_PROCESSING_TEXT,
  [PACKAGE_STATUS_WAREHOUSE_IN_CONTAINER]: PACKAGE_STATUS_PROCESSING_TEXT,
  [PACKAGE_STATUS_WAREHOUSE_IN_SHIPMENT]: PACKAGE_STATUS_PROCESSING_TEXT,
  [PACKAGE_STATUS_WAREHOUSE_EXPORT]: PACKAGE_STATUS_PROCESSING_TEXT,
  [PACKAGE_STATUS_IN_TRANSIT]: PACKAGE_STATUS_IN_TRANSIT_TEXT,
  [PACKAGE_STATUS_DELIVERED]: PACKAGE_STATUS_DELIVERED_TEXT,
  [PACKAGE_STATUS_CANCELLED]: PACKAGE_STATUS_CANCELLED_TEXT,
  [PACKAGE_STATUS_EXPIRED]: PACKAGE_STATUS_EXPIRED_TEXT,
  [PACKAGE_STATUS_IMPORT_HUB]: PACKAGE_STATUS_IN_TRANSIT_TEXT,
  [PACKAGE_STATUS_EXPORT_HUB]: PACKAGE_STATUS_IN_TRANSIT_TEXT,
  [PACKAGE_STATUS_UNDELIVERED]: PACKAGE_STATUS_UNDELIVERED_TEXT,
  [PACKAGE_STATUS_RESHIP]: PACKAGE_STATUS_IN_TRANSIT_TEXT,
  [PACKAGE_STATUS_ARCHIVED]: PACKAGE_STATUS_ARCHIVED_TEXT,
}

export const MAP_PACKAGE_STATUS_CLASSNAMES = {
  [PACKAGE_STATUS_CREATED]: {
    text: PACKAGE_STATUS_CREATED_TEXT,
    className: 'await',
  },
  [PACKAGE_STATUS_PENDING_PICKUP]: {
    text: PACKAGE_STATUS_PENDING_PICKUP_TEXT,
    className: 'pending',
  },
  [PACKAGE_STATUS_PICKED]: {
    text: PACKAGE_STATUS_PROCESSING_TEXT,
    className: 'primary',
  },
  [PACKAGE_STATUS_WAREHOUSE_LABELED]: {
    text: PACKAGE_STATUS_PROCESSING_TEXT,
    className: 'primary',
  },
  [PACKAGE_STATUS_WAREHOUSE_IN_CONTAINER]: {
    text: PACKAGE_STATUS_PROCESSING_TEXT,
    className: 'primary',
  },
  [PACKAGE_STATUS_WAREHOUSE_IN_SHIPMENT]: {
    text: PACKAGE_STATUS_PROCESSING_TEXT,
    className: 'primary',
  },
  [PACKAGE_STATUS_WAREHOUSE_EXPORT]: {
    text: PACKAGE_STATUS_PROCESSING_TEXT,
    className: 'primary',
  },
  [PACKAGE_STATUS_IN_TRANSIT]: {
    text: PACKAGE_STATUS_IN_TRANSIT_TEXT,
    className: 'default',
  },
  [PACKAGE_STATUS_DELIVERED]: {
    text: PACKAGE_STATUS_DELIVERED_TEXT,
    className: 'success',
  },
  [PACKAGE_STATUS_CANCELLED]: {
    text: PACKAGE_STATUS_CANCELLED_TEXT,
    className: 'danger',
  },
  [PACKAGE_STATUS_EXPIRED]: {
    text: PACKAGE_STATUS_EXPIRED_TEXT,
    className: 'expired',
  },
  [PACKAGE_STATUS_IMPORT_HUB]: {
    text: PACKAGE_STATUS_IN_TRANSIT_TEXT,
    className: 'default',
  },
  [PACKAGE_STATUS_EXPORT_HUB]: {
    text: PACKAGE_STATUS_IN_TRANSIT_TEXT,
    className: 'default',
  },
  [PACKAGE_STATUS_UNDELIVERED]: {
    text: PACKAGE_STATUS_UNDELIVERED_TEXT,
    className: 'expired',
  },
  [PACKAGE_STATUS_RESHIP]: {
    text: PACKAGE_STATUS_IN_TRANSIT_TEXT,
    className: 'default',
  },
  [PACKAGE_STATUS_ARCHIVED]: {
    text: PACKAGE_STATUS_ARCHIVED_TEXT,
    className: 'danger',
  },
}

export const MAP_NAME_STATUS_STRING_PACKAGE = {
  ['']: {
    value: '-',
    class: '',
  },
  [PACKAGE_STATUS_CREATED_TEXT]: {
    value: 'pending',
    class: 'badge-primary',
  },
  [PACKAGE_STATUS_PENDING_PICKUP_TEXT]: {
    value: 'Pre-Transit',
    class: 'badge-success',
  },
  [PACKAGE_STATUS_PROCESSING_TEXT]: {
    value: 'processing',
    class: 'badge-primary',
  },
  [PACKAGE_STATUS_IN_TRANSIT_TEXT]: {
    value: 'in-Transit',
    class: 'badge-default',
  },
  [PACKAGE_STATUS_DELIVERED_TEXT]: {
    value: 'delivered',
    class: 'badge-success',
  },
  [PACKAGE_STATUS_ALERT_TEXT]: {
    value: 'alert',
    class: 'badge-alert',
  },
  [PACKAGE_STATUS_CANCELLED_TEXT]: {
    value: 'canceled',
    class: 'badge-danger',
  },
  [PACKAGE_STATUS_EXPIRED_TEXT]: {
    value: 'expired',
    class: 'badge-expired',
  },
  [PACKAGE_STATUS_UNDELIVERED_TEXT]: {
    value: 'undelivered',
    class: 'badge-expired',
  },
  [PACKAGE_STATUS_ARCHIVED_TEXT]: {
    value: 'archived',
    class: 'badge-danger',
  },
}

// cSpell:disable
export const CHANGE_PACKAGE_TYPE = [
  '',
  'Người nhận',
  'Số điện thoại người nhận',
  'Địa chỉ người nhận',
  'Thành phố',
  'Mã vùng',
  'Mã bưu điện',
  'Mã quốc gia',
  'Trọng lượng',
  'Kích thước (DxRxC)',
  'Yêu cầu khi giao',
  'Dịch vụ',
  'Chi tiết hàng hóa',
  'Địa chỉ phụ người nhận',
  'Covid',
  'Quá cỡ',
  'Sửa kích thước',
  'Sửa trọng lượng',
  'Dịch vụ',
  'Sửa đơn',
  'Hoàn tiền',
  'Phí phát sinh khác',
  'Xác nhận xóa cảnh báo địa chỉ không hợp lệ',
  'Bỏ qua kiểm tra địa chỉ bằng API',
  'Reship',
  'Mã đơn hàng',
  'Hủy Label',
]
// cSpell:enable

export const DELIVER_LOG_PACKAGE = {
  [PACKAGE_STATUS_IN_TRANSIT]: 'Arriving at international airport to go abroad',
  [PACKAGE_STATUS_CREATED]: ' Shipping label created, LionBay awaiting item',
  [PACKAGE_STATUS_PENDING_PICKUP]:
    'Shipping label created, LionBay awaiting item',
  [PACKAGE_STATUS_RE_PENDING_PICKUP]:
    'Shipping label created, LionBay awaiting item',
  [PACKAGE_STATUS_PICKED]: 'Accepted at LionBay Processing	Center',
  [PACKAGE_STATUS_CANCELLED]: 'Label canceled',
  [PACKAGE_STATUS_DELIVERED]: 'Delivered',
  [PACKAGE_STATUS_RETURNED]: ' Package returned',
  [PACKAGE_STATUS_WAREHOUSE_EXPORT]: 'Departed from LionBay Processing Center',
  [PACKAGE_STATUS_ARCHIVED]: 'Package archived',
}

export const MAP_NAME_STATUS_WAREHOUSE = {
  [PACKAGE_STATUS_PICKED]: {
    text: 'Đã lấy',
    className: 'primary',
  },
  [PACKAGE_STATUS_PENDING_PICKUP]: {
    text: 'Pre-Transit',
    className: 'default',
  },
  [PACKAGE_STATUS_WAREHOUSE_LABELED]: {
    text: 'Kiểm hàng',
    className: 'success',
  },
  [PACKAGE_STATUS_WAREHOUSE_IN_CONTAINER]: {
    text: 'Đóng kiện',
    className: 'success',
  },
  [PACKAGE_STATUS_WAREHOUSE_IN_SHIPMENT]: {
    text: 'Đóng lô',
    className: 'primary',
  },
  [PACKAGE_STATUS_IN_TRANSIT]: {
    text: 'Xuất kho',
    className: 'success',
  },
  [PACKAGE_STATUS_WAREHOUSE_EXPORT]: {
    text: 'Xuất kho',
    className: 'success',
  },
  [PACKAGE_STATUS_CANCELLED]: {
    text: 'Đã hủy',
    className: 'danger',
  },
  [PACKAGE_STATUS_DELIVERED]: {
    text: 'Giao thành công',
    className: 'success',
  },
  [PACKAGE_STATUS_IMPORT_HUB]: {
    text: 'Hub đã nhận',
    className: 'primary',
  },
  [PACKAGE_STATUS_EXPORT_HUB]: {
    text: 'Hub đã xuất',
    className: 'primary',
  },
  [PACKAGE_STATUS_UNDELIVERED]: {
    text: 'Giao không thành công',
    className: 'expired',
  },
  [PACKAGE_STATUS_RESHIP]: {
    text: 'Reship',
    className: 'default',
  },
}
