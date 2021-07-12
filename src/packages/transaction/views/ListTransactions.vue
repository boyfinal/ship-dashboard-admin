<template>
  <div class="list-packages pages">
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
          <template v-else-if="logs.length">
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
                  <tr v-for="(item, i) in logs" :key="i">
                    <td>
                      {{ transactionType[item.type] }}
                    </td>
                    <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                    <td
                      ><span
                        v-status:status="mapStatus[item.status].value"
                      ></span
                    ></td>
                    <td>
                      {{ item.user.full_name }}
                    </td>
                    <td>{{ item.description }}</td>
                    <td>{{
                      item.type === topupType ? 'Chuyển khoản' : 'N/A'
                    }}</td>
                    <td>{{ getAmount(item) }}</td>
                    <td>
                      <div v-if="showBtn(item)">
                        <p-button
                          @click="handleConfirm(successStatus, item.id)"
                          class="mr-2"
                          :size="'xs'"
                          type="info"
                        >
                          Xác nhận
                        </p-button>
                        <p-button
                          @click="handleConfirm(failStatus, item.id)"
                          :size="'xs'"
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
    this.init()
  },
  computed: {
    ...mapState('transaction', {
      logs: (state) => state.transaction_logs,
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
      const result = await this[FETCH_LIST_TRANSACTIONS](this.filter)
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
      this.init()
    },
    showBtn(log) {
      return (
        log.type === TransactionLogTypeTopup &&
        log.status === TransactionStatusProcess
      )
    },
    getAmount(log) {
      let amount = this.$options.filters.formatPrice(log.amount)
      switch (log.type) {
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
        switch (this.filter.search_by) {
          case 'bill_id':
            this.filter.bill_id = this.filter.search
            this.filter.account_name = ''
            break
          case 'account_name':
            this.filter.account_name = this.filter.search
            this.filter.bill_id = ''
            break
          default:
            break
        }
        this.init()
      },
      deep: true,
    },
  },
}
</script>
