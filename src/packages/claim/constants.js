export const CLAIM_STATUS = [
  {
    value: 1,
    text: 'Đang xử lý',
  },
  {
    value: 2,
    text: 'Đã xử lý',
  },
]

export const CLAIM_STATUS_PENDING = 1
export const CLAIM_STATUS_PROCESSED = 2

export const CLAIM_CUSTOMER_REPLY = 0
export const CLAIM_ADMIN_REPLY = 1

export const MAXIMUM_SIZE = 5

export const MAP_CLAIM_STATUS = {
  [CLAIM_STATUS_PENDING]: {
    text: 'Đang xử lý',
    className: 'pending',
  },
  [CLAIM_STATUS_PROCESSED]: {
    text: 'Đã xử lý',
    className: 'done',
  },
}
