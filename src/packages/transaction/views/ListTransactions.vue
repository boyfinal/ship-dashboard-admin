<template>
  <div class="list-packages pages">
    <div class="page-content">
      <div class="row mb-12" id="search-bar">
        <div class="col-8">
          <p-input
            placeholder="Tìm kiếm ..."
            suffixIcon="search"
            type="search"
            v-model="keywordSearch"
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
                    <td>{{ item.description }}</td>
                    <td>{{
                      item.type === topupType ? 'Chuyển khoản' : 'N/A'
                    }}</td>
                    <td>{{ getAmount(item) }}</td>
                    <td></td>
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
  MAP_NAME_STATUS_TRANSACTION,
} from '../constants'

import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { FETCH_LIST_TRANSACTIONS } from '../store'
export default {
  name: 'ListTransactions',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    TransactionStatusTab,
  },
  data() {
    return {
      filter: {
        limit: 30,
        status: '',
        search: '',
        search_by: 'bill_id',
        type: '',
      },
      keywordSearch: '',
      isFetching: false,
      searchBy: {
        bill_id: 'Mã hoá đơn',
        account_name: 'Tài khoản khách',
      },
      optionType: {
        1: 'Nạp tiền',
        2: 'Thanh toán',
      },
    }
  },
  created() {
    this.filter = this.getRouteQuery()
    this.keywordSearch = this.filter.search
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
  },
  methods: {
    ...mapActions('transaction', [FETCH_LIST_TRANSACTIONS]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      const result = await this[FETCH_LIST_TRANSACTIONS](this.filter)
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
    },
    getAmount(log) {
      switch (log.type) {
        case TransactionLogTypeTopup:
          return `+ $${log.amount} `
        case TransactionLogTypePay:
          return `- $${log.amount} `
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
#search-bar .form-control {
  width: calc(100% - 15px);
}
</style>
