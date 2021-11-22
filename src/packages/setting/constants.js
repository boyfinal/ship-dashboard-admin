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
  [USER_CLASS_PUBLIC]: 'badge-public',
  [USER_CLASS_PRIORITY]: 'badge-priority',
  [USER_CLASS_PARTNER]: 'badge-partner',
}

export const MAP_USER_CLASS_TEXT = {
  [USER_CLASS_PUBLIC]: 'Public',
  [USER_CLASS_PRIORITY]: 'Priority',
  [USER_CLASS_PARTNER]: 'Partner',
}

export const DEBT_LIMIT = [
  { id: 1, value: 2000 },
  { id: 2, value: 4000 },
  { id: 3, value: 5000 },
  { id: 4, value: 8000 },
  { id: 5, value: 10000 },
]
export const DAY_LIMIT = [
  { id: 1, value: 7 },
  { id: 2, value: 15 },
  { id: 3, value: 30 },
  { id: 4, value: 90 },
  { id: 5, value: 180 },
]
