export const PackageStatusCreated = 1
export const PackageStatusPendingPickup = 2
export const PackageStatusPicked = 10
export const PackageStatusWareHouseLabeled = 11
export const PackageStatusWareHouseInContainer = 12
export const PackageStatusWareHouseInShipment = 13
export const PackageStatusWareHouseExport = 14
export const PackageStatusInTransit = 30
export const PackageStatusDelivered = 31
export const PackageStatusReturned = 40
export const PackageStatusCancelled = 50

export const PACKAGE_STATUS_TAB = [
  {
    value: '',
    text: 'Tất cả',
  },
  {
    value: PackageStatusCreated,
    text: 'Tạo mới',
  },
  {
    value: PackageStatusPendingPickup,
    text: 'Chờ lấy',
  },
  {
    value: PackageStatusPicked,
    text: 'Đã lấy',
  },
  {
    value:
      PackageStatusWareHouseLabeled ||
      PackageStatusWareHouseInContainer ||
      PackageStatusWareHouseInShipment ||
      PackageStatusWareHouseExport,
    text: 'Đang xử lý',
  },
  {
    value: PackageStatusInTransit,
    text: 'Đang giao',
  },
  {
    value: PackageStatusDelivered,
    text: 'Giao thành công',
  },
  {
    value: PackageStatusReturned,
    text: 'Trả hàng',
  },
  {
    value: PackageStatusCancelled,
    text: 'Đã huỷ',
  },
]

export const MAP_NAME_STATUS_PACKAGE = {
  [PackageStatusCreated]: {
    value: 'Tạo mới',
    class: 'badge-primary',
  },
  [PackageStatusPendingPickup]: {
    value: 'Chờ lấy',
    class: 'badge-success',
  },
  [PackageStatusPicked]: {
    value: 'Đã lấy',
    class: 'badge-success',
  },
  [PackageStatusWareHouseLabeled ||
  PackageStatusWareHouseInContainer ||
  PackageStatusWareHouseInShipment ||
  PackageStatusWareHouseExport]: {
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
]

export const DELIVER_LOG_PACKAGE = {
  [PackageStatusCreated]: 'Đơn hàng được tạo mới',
  [PackageStatusPendingPickup]: 'Đơn hàng đang chờ lấy',
  [PackageStatusCancelled]: 'Đơn hàng đã bị hủy',
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
  [PackageStatusWareHouseExport]: {
    value: 'Xuất kho',
    class: 'badge-success',
  },
  [PackageStatusReturned]: {
    value: 'Chờ trả tiền',
    class: 'badge-success',
  },
  [PackageStatusCancelled]: {
    value: 'Đã hủy',
    class: 'badge-success',
  },
}
