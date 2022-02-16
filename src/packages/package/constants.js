export const PackageStatusDeactive = 0
export const PackageStatusCreated = 1
export const PackageStatusPendingPickup = 2
export const PackageStatusRePendingPickup = 3
export const PackageStatusPicked = 10
export const PackageStatusWareHouseLabeled = 11
export const PackageStatusWareHouseInContainer = 12
export const PackageStatusWareHouseInShipment = 13
export const PackageStatusWareHouseExport = 14
export const PackageStatusImportHub = 15
export const PackageStatusExportHub = 16
export const PackageStatusInTransit = 30
export const PackageStatusDelivered = 60
export const PackageStatusReturned = 40
export const PackageStatusCancelled = 50
export const PackageStatusExpired = 70

export const PackageStatusCreatedText = 'pending'
export const PackageStatusPendingPickupText = 'pre-transit'
export const PackageStatusProcessingText = 'processing'
export const PackageStatusInTransitText = 'in-transit'
export const PackageStatusImportHubText = 'import-hub'
export const PackageStatusExportHubText = 'export-hub'
export const PackageStatusDeliveredText = 'delivered'
export const PackageStatusAlertText = 'alert'
export const PackageStatusCancelledText = 'canceled'
export const PackageStatusExpiredText = 'expired'

export const PackageAlertTypeOverPretransit = 1
export const PackageAlertTypeWarehoseReturn = 2
export const PackageAlertTypeHubReturn = 3

export const PACKAGE_STATUS_TAB = [
  {
    value: '',
    text: 'All',
  },
  {
    value: PackageStatusCreatedText,
    text: 'Pending',
  },
  {
    value: PackageStatusPendingPickupText,
    text: 'Pre-Transit',
  },
  {
    value: PackageStatusProcessingText,
    text: 'Processing',
  },
  {
    value: PackageStatusInTransitText,
    text: 'In-Transit',
  },
  {
    value: PackageStatusDeliveredText,
    text: 'Delivered',
  },
  {
    value: PackageStatusAlertText,
    text: 'Alert',
  },
  {
    value: PackageStatusCancelledText,
    text: 'Canceled',
  },
  {
    value: PackageStatusExpiredText,
    text: 'Expired',
  },
  {
    value: PackageStatusImportHubText,
    text: 'Import-Hub',
  },
  {
    value: PackageStatusExportHubText,
    text: 'Export-Hub',
  },
]

export const MAP_NAME_STATUS_PACKAGE = {
  ['']: {
    value: '-',
    class: '',
  },
  [PackageStatusCreated]: {
    value: 'Pending',
    class: 'badge-primary',
  },
  [PackageStatusPendingPickup]: {
    value: 'Pre-Transit',
    class: 'badge-success',
  },
  [PackageStatusPicked]: {
    value: 'Processing',
    class: 'badge-success',
  },
  [PackageStatusWareHouseLabeled]: {
    value: 'Processing',
    class: 'badge-success',
  },
  [PackageStatusWareHouseInContainer]: {
    value: 'Processing',
    class: 'badge-success',
  },
  [PackageStatusWareHouseInShipment]: {
    value: 'Processing',
    class: 'badge-success',
  },
  [PackageStatusWareHouseExport]: {
    value: 'Processing',
    class: 'badge-success',
  },
  [PackageStatusInTransit]: {
    value: 'In-Transit',
    class: 'badge-success',
  },
  [PackageStatusDelivered]: {
    value: 'Delivered',
    class: 'badge-success',
  },
  [PackageStatusCancelled]: {
    value: 'Canceled',
    class: 'badge-success',
  },
  [PackageStatusExpired]: {
    value: 'Expired',
    class: 'badge-success',
  },
  [PackageStatusImportHub]: {
    value: 'Import Hub',
    class: 'badge-success',
  },
  [PackageStatusExportHub]: {
    value: 'Export Hub',
    class: 'badge-success',
  },
}

export const MAP_NAME_STATUS_STRING_PACKAGE = {
  ['']: {
    value: '-',
    class: '',
  },
  [PackageStatusCreatedText]: {
    value: 'pending',
    class: 'badge-primary',
  },
  [PackageStatusPendingPickupText]: {
    value: 'Pre-Transit',
    class: 'badge-success',
  },
  [PackageStatusProcessingText]: {
    value: 'processing',
    class: 'badge-primary',
  },
  [PackageStatusInTransitText]: {
    value: 'in-Transit',
    class: 'badge-default',
  },
  [PackageStatusDeliveredText]: {
    value: 'delivered',
    class: 'badge-success',
  },
  [PackageStatusAlertText]: {
    value: 'alert',
    class: 'badge-alert',
  },
  [PackageStatusCancelledText]: {
    value: 'canceled',
    class: 'badge-danger',
  },
  [PackageStatusExpiredText]: {
    value: 'expired',
    class: 'badge-expired',
  },
  [PackageStatusImportHubText]: {
    value: 'import-hub',
    class: 'badge-expired',
  },
  [PackageStatusExportHubText]: {
    value: 'export-hub',
    class: 'badge-expired',
  },
}

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
  'Mã đơn hàng',
]

export const DELIVER_LOG_PACKAGE = {
  [PackageStatusInTransit]: 'Arriving at international airport to go abroad',
  [PackageStatusCreated]: ' Shipping label created, LionBay awaiting item',
  [PackageStatusPendingPickup]: 'Shipping label created, LionBay awaiting item',
  [PackageStatusRePendingPickup]:
    'Shipping label created, LionBay awaiting item',
  [PackageStatusPicked]: 'Accepted at LionBay Processing	Center',
  [PackageStatusCancelled]: 'Label canceled',
  [PackageStatusDelivered]: 'Delivered',
  [PackageStatusReturned]: ' Package returned',
  [PackageStatusWareHouseExport]: 'Departed from LionBay Processing Center',
}

export const MAP_NAME_STATUS_WAREHOUSE = {
  [PackageStatusPicked]: {
    value: 'Đã lấy',
    class: 'badge-primary',
  },
  [PackageStatusWareHouseLabeled]: {
    value: 'Kiểm hàng',
    class: 'badge-success',
  },
  [PackageStatusWareHouseInContainer]: {
    value: 'Đóng kiện',
    class: 'badge-success',
  },
  [PackageStatusWareHouseInShipment]: {
    value: 'Đóng lô',
    class: 'badge-primary',
  },
  [PackageStatusInTransit]: {
    value: 'Xuất kho',
    class: 'badge-success',
  },
  [PackageStatusWareHouseExport]: {
    value: 'Xuất kho',
    class: 'badge-success',
  },
  [PackageStatusCancelled]: {
    value: 'Đã hủy',
    class: 'badge-danger',
  },
  [PackageStatusDelivered]: {
    value: 'Xuất kho',
    class: 'badge-success',
  },
  [PackageStatusImportHub]: {
    value: 'Nhập hub',
    class: 'badge-success',
  },
  [PackageStatusExportHub]: {
    value: 'Xuất hub',
    class: 'badge-success',
  },
}
