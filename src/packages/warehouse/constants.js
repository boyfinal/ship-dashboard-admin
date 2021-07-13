export const PackageWareHouseStatusPick = 1
export const PackageWareHouseStatusChecked = 2
export const PackageWareHouseStatusLabeled = 3
export const PackageWareHouseStatusInContainer = 4
export const PackageWareHouseStatusInShipment = 5
export const PackageWareHouseStatusExport = 6
export const PackageWareHouseStatusReturn = 7
export const PackageWareHouseStatusCancelled = 8
export const PACKAGE_IN_WAREHOUSE_STATUS_TAB = [
  {
    value: '',
    text: 'Tất cả',
  },
  {
    value: PackageWareHouseStatusPick,
    text: 'Đã lấy',
  },
  {
    value: PackageWareHouseStatusChecked,
    text: 'Kiểm hàng',
  },
  {
    value: PackageWareHouseStatusLabeled,
    text: 'Đã dán nhãn',
  },
  {
    value: PackageWareHouseStatusInContainer,
    text: 'Đóng kiện',
  },
  {
    value: PackageWareHouseStatusInShipment,
    text: 'Đóng lô',
  },
  {
    value: PackageWareHouseStatusExport,
    text: 'Xuất kho',
  },
  {
    value: PackageWareHouseStatusReturn,
    text: 'Trả hàng',
  },
  {
    value: PackageWareHouseStatusCancelled,
    text: 'Hủy',
  },
]

export const MAP_NAME_STATUS_PACKAGE = {
  // [PackageStatusInit]: {
  //   value: 'Tạo mới',
  //   class: 'badge-primary',
  // },
  // [PackageStatusWattingTransport]: {
  //   value: 'Chờ lấy',
  //   class: 'badge-success',
  // },
  // [PackageStatusTransported]: {
  //   value: 'Đã lấy',
  //   class: 'badge-success',
  // },
  // [PackageStatusProcessing]: {
  //   value: 'Đang xử lý',
  //   class: 'badge-success',
  // },
  // [PackageStatusShipping]: {
  //   value: 'Đang giao',
  //   class: 'badge-success',
  // },
  // [PackageStatusShipSuccess]: {
  //   value: 'Giao thành công',
  //   class: 'badge-success',
  // },
  // [PackageStatusReturn]: {
  //   value: 'Trả hàng',
  //   class: 'badge-success',
  // },
  // [PackageStatusCancel]: {
  //   value: 'Đã hủy',
  //   class: 'badge-success',
  // },
}
