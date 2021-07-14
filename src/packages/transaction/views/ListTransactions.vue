<template>
  <div class="list-transactions pages">
    <div class="page-content">
      <div class="row mb-12" id="search-bar">
        <div class="col-8">
          <p-input
            :placeholder="getPlaceHolder"
            suffixIcon="search"
            type="search"
            :value="filter.search"
            @keyup.enter="handleSearch"
          >
          </p-input>
        </div>
        <div class="col-2">
          <p-select placeholder="Please select" v-model="filter.search_by">
            <option :value="key" v-for="(value, key) in searchBy" :key="key">
              {{ value }}
            </option>
          </p-select>
        </div>
        <div class="col-2">
          <p-select placeholder="Please select" v-model="filter.type">
            <option value="">Tất cả</option>
            <option :value="key" v-for="(value, key) in optionType" :key="key">
              {{ value }}
            </option>
          </p-select>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <transaction-status-tab
            :has-all="false"
            :status="statusTab"
            v-model="filter.status"
            :count-status="count_status"
          />
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="transactions.length">
            <div class="table-responsive">
              <table class="table table-hover" id="tbl-packages">
                <thead>
                  <tr>
                    <template>
                      <th>Loại</th>
                      <th>Ngày tạo</th>
                      <th>Trạng thái</th>
                      <th>Khách hàng</th>
                      <th>Nội dung</th>
                      <th>Hình thức</th>
                      <th>Giá trị</th>
                      <th>Thao tác</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in transactions" :key="i">
                    <td :title="transactionType[item.type]">
                      <span class="tool-tip">{{
                        transactionType[item.type]
                      }}</span>
                    </td>
                    <td :title="item.created_at | date('dd/MM/yyyy')"
                      ><span>{{
                        item.created_at | date('dd/MM/yyyy')
                      }}</span></td
                    >
                    <td :title="mapStatus[item.status].value"
                      ><span
                        v-status:status="mapStatus[item.status].value"
                      ></span
                    ></td>
                    <td :title="item.user.full_name">
                      <span class="tool-tip"> {{ item.user.full_name }}</span>
                    </td>
                    <td :title="getTitle(item)"
                      ><span
                        class="tool-tip"
                        v-html="getDescription(item)"
                      ></span
                    ></td>
                    <td
                      :title="item.type === topupType ? 'Chuyển khoản' : 'N/A'"
                    >
                      <span class="tool-tip">{{
                        item.type === topupType ? 'Chuyển khoản' : 'N/A'
                      }}</span>
                    </td>
                    <td width="120px" :title="getAmount(item)"
                      ><span style="white-space: nowrap;">{{
                        getAmount(item)
                      }}</span></td
                    >
                    <td class="btn-action">
                      <div v-if="showBtn(item)" style="display: flex">
                        <p-button
                          @click="handleConfirm(successStatus, item.id)"
                          class="mr-2"
                          type="info"
                        >
                          Xác nhận
                        </p-button>
                        <p-button
                          @click="handleConfirm(failStatus, item.id)"
                          type="danger"
                        >
                          Thất bại
                        </p-button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              class="d-flex justify-content-between align-items-center mb-16"
              v-if="count > 0"
            >
              <p-pagination
                :filter-limit="false"
                :total="count"
                :perPage.sync="filter.limit"
                :current.sync="filter.page"
                size="sm"
              ></p-pagination>
            </div>
          </template>
          <empty-search-result v-else></empty-search-result>
        </div>
      </div>
    </div>
    <modal-confirm
      :visible.sync="visibleConfirmSuccess"
      :actionConfirm="`Có`"
      :cancel="`Không`"
      :description="`Bạn có chắc chắn về giao dịch này ?`"
      :title="`Xác nhận giao dịch`"
      @action="changeStatusTransactionHandle(successStatus)"
      :loading="isChangingStatus"
      :disabled="isChangingStatus"
    ></modal-confirm>
    <modal-confirm
      :visible.sync="visibleConfirmFail"
      :actionConfirm="`Có`"
      :cancel="`Không`"
      :description="`Bạn có chắc chắn giao dịch này không thành công ?`"
      :title="`Xác nhận thất bại`"
      @action="changeStatusTransactionHandle(failStatus)"
      :loading="isChangingStatus"
      :disabled="isChangingStatus"
    ></modal-confirm>
  </div>
</template>
<script>
import TransactionStatusTab from '../components/TransactionStatusTab'
import { mapState, mapActions } from 'vuex'

import {
  TRANSACTION_STATUS_TAB,
  TRANSACTION_TYPE,
  TransactionLogTypeTopup,
  TransactionLogTypePay,
  TransactionStatusProcess,
  TransactionStatusSuccess,
  TransactionStatusFailure,
  MAP_NAME_STATUS_TRANSACTION,
} from '../constants'

import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { FETCH_LIST_TRANSACTIONS, CHANGE_STATUS_TRANSACTION } from '../store'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import { cloneDeep } from '../../../core/utils'
export default {
  name: 'ListTransactions',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    TransactionStatusTab,
    ModalConfirm,
  },
  data() {
    return {
      filter: {
        limit: 30,
        status: '',
        search: '',
        search_by: 'bill_id',
        bill_id: '',
        account_name: '',
        type: '',
      },
      isFetching: false,
      searchBy: {
        bill_id: 'Mã hoá đơn',
        account_name: 'Tài khoản khách',
      },
      optionType: {
        1: 'Nạp tiền',
        2: 'Thanh toán',
      },
      isChangingStatus: false,
      visibleConfirmSuccess: false,
      visibleConfirmFail: false,
      actionID: '',
    }
  },
  created() {
    this.filter = this.getRouteQuery()
  },
  computed: {
    ...mapState('transaction', {
      transactions: (state) => state.transactions,
      count: (state) => state.count,
      count_status: (state) => state.count_status,
    }),
    transactionType() {
      return TRANSACTION_TYPE
    },
    statusTab() {
      return TRANSACTION_STATUS_TAB
    },
    mapStatus() {
      return MAP_NAME_STATUS_TRANSACTION
    },
    topupType() {
      return TransactionLogTypeTopup
    },
    successStatus() {
      return TransactionStatusSuccess
    },
    getPlaceHolder() {
      switch (this.filter.search_by) {
        case 'bill_id':
          return 'Tìm theo mã hóa đơn'
        case 'account_name':
          return 'Tìm theo tài khoản khách'
        default:
          return ''
      }
    },
    failStatus() {
      return TransactionStatusFailure
    },
  },
  methods: {
    ...mapActions('transaction', [
      FETCH_LIST_TRANSACTIONS,
      CHANGE_STATUS_TRANSACTION,
    ]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      let payload = cloneDeep(this.filter)
      switch (this.filter.search_by) {
        case 'bill_id':
          payload.bill_id = this.filter.search
          delete payload.account_name
          break
        case 'account_name':
          payload.account_name = this.filter.search
          delete payload.bill_id
          break
        default:
          break
      }
      const result = await this[FETCH_LIST_TRANSACTIONS](payload)
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
    },
    handleConfirm(status, id) {
      this.actionID = id
      switch (status) {
        case TransactionStatusSuccess:
          this.visibleConfirmSuccess = true
          break
        case TransactionStatusFailure:
          this.visibleConfirmFail = true
          break
        default:
          break
      }
    },
    async changeStatusTransactionHandle(status) {
      this.isChangingStatus = true
      const payload = {
        id: this.actionID,
        status: status,
      }
      const result = await this[CHANGE_STATUS_TRANSACTION](payload)
      this.isChangingStatus = false
      this.visibleConfirmSuccess = false
      this.visibleConfirmFail = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
      let msg = ''
      switch (status) {
        case TransactionStatusSuccess:
          msg = 'Xác nhận giao dịch thành công'
          break
        case TransactionStatusFailure:
          msg = 'Xác nhận giao dịch thất bại thành công'
          break
        default:
          break
      }
      this.$toast.open({ message: msg, type: 'success' })
      await this.init()
    },
    showBtn(transaction) {
      return (
        transaction.type === TransactionLogTypeTopup &&
        transaction.status === TransactionStatusProcess
      )
    },
    getTitle(transaction) {
      switch (transaction.type) {
        case TransactionLogTypeTopup:
          return `Nạp topup ${transaction.id}`
        case TransactionLogTypePay:
          return `Thanh toán hóa đơn #${transaction.bill_id}`
        default:
          return null
      }
    },
    getDescription(transaction) {
      let path = ''
      switch (transaction.type) {
        case TransactionLogTypeTopup:
          return `Nạp topup <strong>#${transaction.id}</strong>`
        case TransactionLogTypePay:
          path = this.$router.resolve({
            name: 'bill-detail',
            params: { id: transaction.bill_id },
          }).href
          return `Thanh toán hóa đơn <a href="${path}"><strong>#${transaction.bill_id}</strong></a>`
        default:
          return null
      }
    },
    getAmount(transaction) {
      let amount = this.$options.filters.formatPrice(transaction.amount)
      switch (transaction.type) {
        case TransactionLogTypeTopup:
          return `+ ${amount} `
        case TransactionLogTypePay:
          return `- ${amount} `
        default:
          return null
      }
    },
  },
  watch: {
    filter: {
      handler: function() {
        this.init()
      },
      deep: true,
    },
  },
}
</script>

<style>
@media screen and (max-width: 1400px) {
  .btn-action .btn {
    padding: 0.4rem 1rem !important;
    white-space: nowrap;
  }
  .btn-action {
    min-width: 180px;
  }
  .list-transactions td > span.tool-tip {
    width: 100%;
    height: 23px;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
  }
}
</style>
