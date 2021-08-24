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
export const PackageStatusReturned = 40
export const PackageStatusCancelled = 50

export const PackageStatusCreatedText = 'created'
export const PackageStatusPendingPickupText = 'pending-pickup'
export const PackageStatusProcessingText = 'processing'
export const PackageStatusInTransitText = 'in-transit'
export const PackageStatusDeliveredText = 'delivered'
export const PackageStatusReturnText = 'return'
export const PackageStatusCancelledText = 'cancelled'

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
    value: PackageStatusReturnText,
    text: 'Trả hàng',
  },
  {
    value: PackageStatusCancelledText,
    text: 'Đã huỷ',
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
  [PackageStatusReturned]: {
    value: 'Trả hàng',
    class: 'badge-success',
  },
  [PackageStatusCancelled]: {
    value: 'Đã hủy',
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
  [PackageStatusReturnText]: {
    value: 'Trả hàng',
    class: 'badge-success',
  },
  [PackageStatusCancelledText]: {
    value: 'Đã hủy',
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
]

export const DELIVER_LOG_PACKAGE = {
  [PackageStatusInTransit]: 'Đơn hàng đang vận chuyển',
  [PackageStatusCreated]: 'Đơn hàng được tạo mới',
  [PackageStatusPendingPickup]: 'Đơn hàng đang chờ lấy',
  [PackageStatusRePendingPickup]: 'Đơn hàng đã được chuyển lại',
  [PackageStatusPicked]: 'Đơn hàng được xác nhận đã giao cho nhân viên kho',
  [PackageStatusCancelled]: 'Đơn hàng đã bị hủy',
  [PackageStatusReturned]: 'Đơn hàng bị trả trong quá trình vận chuyển',
  [PackageStatusWareHouseExport]: 'Đơn hàng đã xuất kho',
  [PackageStatusDelivered]: 'Đơn hàng đã được giao',
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
  [PackageStatusReturned]: {
    value: 'Trả hàng',
    class: 'badge-success',
  },
  [PackageStatusCancelled]: {
    value: 'Đã hủy',
    class: 'badge-success',
  },
}
