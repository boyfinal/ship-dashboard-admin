export const TransactionLogTypeTopup = 1
export const TransactionLogTypePay = 2
export const TransactionLogTypeRefund = 4
export const TransactionLogTypePayoneer = 5
export const TransactionLogTypePingPong = 6

export const TransactionStatusProcess = 1
export const TransactionStatusSuccess = 2
export const TransactionStatusFailure = 3
export const TransactionStatusReFund = 4
export const TRANSACTION_STATUS_TAB = [
  {
    value: '',
    text: 'Tất cả',
  },
  {
    value: TransactionStatusProcess,
    text: 'Chờ xác nhận',
  },
  {
    value: TransactionStatusSuccess,
    text: 'Thành công',
  },
  {
    value: TransactionStatusFailure,
    text: 'Từ chối',
  },
]
export const MAP_NAME_STATUS_TRANSACTION = {
  [TransactionStatusProcess]: {
    value: 'Chờ xác nhận',
    class: 'badge-primary',
  },
  [TransactionStatusSuccess]: {
    value: 'Thành công',
    class: 'badge-success',
  },
  [TransactionStatusFailure]: {
    value: 'Từ chối',
    class: 'badge-danger',
  },
  [TransactionStatusReFund]: {
    value: 'Hoàn tiền',
    class: 'badge-danger',
  },
}

export const TRANSACTION_TYPE = {
  [TransactionLogTypeTopup]: 'Nạp tiền',
  [TransactionLogTypePayoneer]: 'Nạp tiền',
  [TransactionLogTypePingPong]: 'Nạp tiền',
  [TransactionLogTypePay]: 'Thanh toán',
  [TransactionLogTypeRefund]: 'Hoàn tiền',
}
