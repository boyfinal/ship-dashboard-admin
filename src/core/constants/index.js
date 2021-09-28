// Roles
export const ROLE_ADMIN = 'admin'
export const ROLE_ACCOUNTANT = 'accountant'
export const ROLE_WAREHOUSE = 'warehouse'
export const ROLE_SUPPORT = 'support'
export const ROLE_CUSTOMER = 'customer'

export const ACL_KEYS = {
  setStatusPaid: 'setStatusPaid',
  setStatusUnPaid: 'setStatusUnPaid',
  setStatusProcess: 'setStatusProcess',
  setStatusContainerCancel: 'setStatusContainerCancel',
  setStatusOrderCancel: 'setStatusOrderCancel',
  importTrackingNumber: 'updateTrackingNumber',
  updateOrder: 'updateOrder',
}

export const ACL = {}

export const NOT_STAFF_GET_LIMIT = 200

export const MAX_DESIGN_FILE = 15
