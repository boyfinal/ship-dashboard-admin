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
  [PackageWareHouseStatusPick]: {
    value: 'Đã lấy',
    class: 'badge-primary',
  },
  [PackageStatusWareHouseLabeled]: {
    value: 'Kiểm hàng',
    class: 'badge-success',
  },
  [PackageWareHouseStatusInContainer]: {
    value: 'Đóng kiện',
    class: 'badge-success',
  },
  [PackageWareHouseStatusInShipment]: {
    value: 'Đóng lô',
    class: 'badge-success',
  },
  [PackageWareHouseStatusExport]: {
    value: 'Xuất kho',
    class: 'badge-success',
  },
  [PackageWareHouseStatusReturn]: {
    value: 'Trả hàng',
    class: 'badge-warning',
  },
  [PackageWareHouseStatusCancelled]: {
    value: 'Hủy',
    class: 'badge-danger',
  },
}
