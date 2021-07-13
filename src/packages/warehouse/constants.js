export const PackageStatusInit = 1
export const PackageStatusWattingTransport = 2
export const PackageStatusTransported = 3
export const PackageStatusProcessing = 4
export const PackageStatusShipping = 5
export const PackageStatusShipSuccess = 6
export const PackageStatusReturn = 7
export const PackageStatusCancel = 8
export const PACKAGE_STATUS_TAB = [
  {
    value: '',
    text: 'Tất cả',
  },
  {
    value: PackageStatusInit,
    text: 'Tạo mới',
  },
  {
    value: PackageStatusWattingTransport,
    text: 'Chờ lấy',
  },
  {
    value: PackageStatusTransported,
    text: 'Đã lấy',
  },
  {
    value: PackageStatusProcessing,
    text: 'Đang xử lý',
  },
  {
    value: PackageStatusShipping,
    text: 'Đang giao',
  },
  {
    value: PackageStatusShipSuccess,
    text: 'Giao thành công',
  },
  {
    value: PackageStatusReturn,
    text: 'Trả hàng',
  },
  {
    value: PackageStatusCancel,
    text: 'Đã huỷ',
  },
]

export const MAP_NAME_STATUS_PACKAGE = {
  [PackageStatusInit]: {
    value: 'Tạo mới',
    class: 'badge-primary',
  },
  [PackageStatusWattingTransport]: {
    value: 'Chờ lấy',
    class: 'badge-success',
  },
  [PackageStatusTransported]: {
    value: 'Đã lấy',
    class: 'badge-success',
  },
  [PackageStatusProcessing]: {
    value: 'Đang xử lý',
    class: 'badge-success',
  },
  [PackageStatusShipping]: {
    value: 'Đang giao',
    class: 'badge-success',
  },
  [PackageStatusShipSuccess]: {
    value: 'Giao thành công',
    class: 'badge-success',
  },
  [PackageStatusReturn]: {
    value: 'Trả hàng',
    class: 'badge-success',
  },
  [PackageStatusCancel]: {
    value: 'Đã hủy',
    class: 'badge-success',
  },
}
