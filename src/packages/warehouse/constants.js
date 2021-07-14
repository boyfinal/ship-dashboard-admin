export const PackageWareHouseStatusPick = 10
export const PackageStatusWareHouseLabeled = 11
export const PackageWareHouseStatusInContainer = 12
export const PackageWareHouseStatusInShipment = 13
export const PackageWareHouseStatusExport = 14
export const PackageWareHouseStatusReturn = 40
export const PackageWareHouseStatusCancelled = 50
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
    value: PackageStatusWareHouseLabeled,
    text: 'Kiểm hàng',
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
