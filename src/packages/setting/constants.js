import {
  ROLE_ADMIN,
  ROLE_ACCOUNTANT,
  ROLE_WAREHOUSE,
  ROLE_SUPPORT,
  ROLE_HUB,
} from '@core/constants'

export const USER_STATUS_DEACTIVE = 0
export const USER_STATUS_ACTIVE = 1

export const HUB_TYPE = 1
export const WAREHOUSE_TYPE = 2

export const USER_STATUS_TAB = {
  'Không hoạt động': 0,
  'Hoạt động': 1,
}

export const ROLE = [
  {
    key: ROLE_ADMIN,
    name: 'Admin',
  },
  {
    key: ROLE_ACCOUNTANT,
    name: 'Kế toán',
  },
  {
    key: ROLE_WAREHOUSE,
    name: 'Kho',
  },
  {
    key: ROLE_SUPPORT,
    name: 'Support',
  },
  {
    key: ROLE_HUB,
    name: 'Hub',
  },
]

export const USER_CLASS_PUBLIC = 1
export const USER_CLASS_PRIORITY = 2
export const USER_CLASS_PARTNER = 3

export const MAP_USER_CLASS_ICON = {
  [USER_CLASS_PUBLIC]: 'public-class',
  [USER_CLASS_PRIORITY]: 'priority-class',
  [USER_CLASS_PARTNER]: 'partner-class',
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
