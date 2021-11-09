export const USER_STATUS_DEACTIVE = 0
export const USER_STATUS_ACTIVE = 1

export const USER_STATUS_TAB = {
  'Không kích hoạt': 0,
  'Kích hoạt': 1,
}

export const ROLE = [
  {
    key: 'admin',
    name: 'Admin',
  },
  {
    key: 'accountant',
    name: 'Kế toán',
  },
  {
    key: 'warehouse',
    name: 'Kho',
  },
  {
    key: 'support',
    name: 'Support',
  },
]

export const USER_CLASS_PUBLIC = 1
export const USER_CLASS_PRIORITY = 2
export const USER_CLASS_PARTNER = 3

export const MAP_USER_CLASS_ICON = {
  [USER_CLASS_PUBLIC]: 'badge-primary',
  [USER_CLASS_PRIORITY]: 'badge-danger',
  [USER_CLASS_PARTNER]: 'badge-success',
}

export const MAP_USER_CLASS_TEXT = {
  [USER_CLASS_PUBLIC]: 'Public',
  [USER_CLASS_PRIORITY]: 'Priority',
  [USER_CLASS_PARTNER]: 'Partner',
}
