export const PackageStatusDeactive = 0
export const PackageStatusCreated = 1
export const PackageStatusPendingPickup = 2
export const PackageStatusRePendingPickup = 3
export const PackageStatusPicked = 10
export const PackageStatusWareHouseLabeled = 11
export const PackageStatusWareHouseInContainer = 12
export const PackageStatusWareHouseInShipment = 13
export const PackageStatusWareHouseExport = 14
export const PackageStatusInTransit = 30
export const PackageStatusDelivered = 60
export const PackageStatusAlert = 40
export const PackageStatusCancelled = 50
export const PackageStatusExpired = 70

export const PackageStatusCreatedText = 'created'
export const PackageStatusPendingPickupText = 'pending-pickup'
export const PackageStatusProcessingText = 'processing'
export const PackageStatusInTransitText = 'in-Transit'
export const PackageStatusDeliveredText = 'delivered'
export const PackageStatusAlertText = 'alert'
export const PackageStatusCancelledText = 'canceled'
export const PackageStatusExpiredText = 'expired'

export const PACKAGE_STATUS_TAB = [
  {
    value: '',
    text: 'Tất cả',
  },
  {
    value: PackageStatusCreatedText,
    text: 'Tạo mới',
  },
  {
    value: PackageStatusPendingPickupText,
    text: 'Chờ lấy',
  },
  {
    value: PackageStatusProcessingText,
    text: 'Đang xử lý',
  },
  {
    value: PackageStatusInTransitText,
    text: 'Đang giao',
  },
  {
    value: PackageStatusDeliveredText,
    text: 'Giao thành công',
  },
  {
    value: PackageStatusAlertText,
    text: 'Trả hàng',
  },
  {
    value: PackageStatusCancelledText,
    text: 'Đã huỷ',
  },
  {
    value: PackageStatusExpiredText,
    text: 'Hết hạn',
  },
]

export const MAP_NAME_STATUS_PACKAGE = {
  ['']: {
    value: '-',
    class: '',
  },
  [PackageStatusCreated]: {
    value: 'Tạo mới',
    class: 'badge-primary',
  },
  [PackageStatusPendingPickup]: {
    value: 'Chờ lấy',
    class: 'badge-success',
  },
  [PackageStatusPicked]: {
    value: 'Đang xử lý',
    class: 'badge-success',
  },
  [PackageStatusWareHouseLabeled]: {
    value: 'Đang xử lý',
    class: 'badge-success',
  },
  [PackageStatusWareHouseInContainer]: {
    value: 'Đang xử lý',
    class: 'badge-success',
  },
  [PackageStatusWareHouseInShipment]: {
    value: 'Đang xử lý',
    class: 'badge-success',
  },
  [PackageStatusInTransit]: {
    value: 'Đang giao',
    class: 'badge-success',
  },
  [PackageStatusDelivered]: {
    value: 'Giao thành công',
    class: 'badge-success',
  },
  [PackageStatusAlert]: {
    value: 'Trả hàng',
    class: 'badge-success',
  },
  [PackageStatusCancelled]: {
    value: 'Đã hủy',
    class: 'badge-success',
  },
  [PackageStatusExpired]: {
    value: 'Hết hạn',
    class: 'badge-success',
  },
}

export const MAP_NAME_STATUS_STRING_PACKAGE = {
  ['']: {
    value: '-',
    class: '',
  },
  [PackageStatusCreatedText]: {
    value: 'Tạo mới',
    class: 'badge-primary',
  },
  [PackageStatusPendingPickupText]: {
    value: 'Chờ lấy',
    class: 'badge-success',
  },
  [PackageStatusProcessingText]: {
    value: 'Đang xử lý',
    class: 'badge-success',
  },
  [PackageStatusInTransitText]: {
    value: 'Đang giao',
    class: 'badge-success',
  },
  [PackageStatusDeliveredText]: {
    value: 'Giao thành công',
    class: 'badge-success',
  },
  [PackageStatusAlertText]: {
    value: 'Trả hàng',
    class: 'badge-success',
  },
  [PackageStatusCancelledText]: {
    value: 'Đã hủy',
    class: 'badge-success',
  },
  [PackageStatusExpiredText]: {
    value: 'Hết hạn',
    class: 'badge-success',
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
]

export const DELIVER_LOG_PACKAGE = {
  [PackageStatusInTransit]: 'In transit',
  [PackageStatusCreated]: ' Shipping label created, LionBay awaiting item',
  [PackageStatusPendingPickup]:
    'Shipping label confirmed, LionBay awaiting item',
  [PackageStatusRePendingPickup]:
    'Shipping label confirmed, LionBay awaiting item',
  [PackageStatusPicked]: 'Accepted at LionBay Origin Facility',
  [PackageStatusCancelled]: 'Label canceled',
  [PackageStatusAlert]: ' Package returned',
  [PackageStatusDelivered]: 'Delivered',
  [PackageStatusWareHouseExport]:
    'Your package is on the way to international airport',
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
    class: 'badge-success',
  },
  [PackageStatusInTransit]: {
    value: 'Xuất kho',
    class: 'badge-success',
  },
  [PackageStatusAlert]: {
    value: 'Trả hàng',
    class: 'badge-success',
  },
  [PackageStatusCancelled]: {
    value: 'Đã hủy',
    class: 'badge-success',
  },
  [PackageStatusDelivered]: {
    value: 'Xuất kho',
    class: 'badge-success',
  },
}
