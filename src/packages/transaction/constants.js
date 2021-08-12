export const TransactionLogTypeTopup = 1
export const TransactionLogTypePay = 2
export const TransactionLogTypeRefund = 4
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
    text: 'Thất bại',
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
    value: 'Thất bại',
    class: 'badge-danger',
  },
  [TransactionStatusReFund]: {
    value: 'Hoàn tiền',
    class: 'badge-danger',
  },
}

export const TRANSACTION_TYPE = {
  [TransactionLogTypeTopup]: 'Nạp tiền',
  [TransactionLogTypePay]: 'Thanh toán',
  [TransactionLogTypeRefund]: 'Hoàn tiền',
}
