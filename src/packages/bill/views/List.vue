<template>
  <div class="pages list__claim">
    <div class="page-content">
      <div class="row mb-12">
        <div class="col-9">
          <p-input
            :placeholder="searchPlaceholder"
            prefixIcon="search"
            type="search"
            clearable
            :value.sync="filter.search"
            @keyup.enter="handleSearch"
          >
          </p-input>
        </div>
        <div class="col-3">
          <select v-model="filter.search_by" class="form-control">
            <option value="id">Mã hoá đơn</option>
            <option value="code">Mã vận đơn</option>
            <option value="customer">Khách hàng</option>
          </select>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="list__bill-list">
            <status-tab v-model="filter.status" :status="statusTabs" />
            <vcl-table class="md-20" v-if="isFetching"></vcl-table>
            <template v-else-if="bills.length > 0">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr class="list__claim-title">
                      <th>MÃ HÓA ĐƠN</th>
                      <th>NGÀY TẠO</th>
                      <th>TRẠNG THÁI</th>
                      <th>PHÍ GIAO</th>
                      <th>PHÍ PHÁT SINH</th>
                      <th>TỔNG HÓA ĐƠN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in bills" :key="item.id">
                      <td>
                        <router-link
                          class="text-no-underline"
                          :to="{
                            name: 'bill-detail',
                            params: { id: item.id },
                          }"
                        >
                          {{ item.id }}
                        </router-link>
                      </td>
                      <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                      <td>
                        <span
                          class="badge badge-round"
                          :class="item.status | statusClass"
                          >{{ item.status | statusText }}</span
                        >
                      </td>
                      <td>{{ item.shipping_fee | formatNumber }}</td>
                      <td>{{ item.extra_fee | formatNumber }}</td>
                      <td>{{
                        (item.shipping_fee + item.extra_fee) | formatNumber
                      }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
            <EmptySearchResult v-else></EmptySearchResult>
          </div>
          <div
            class="d-flex justify-content-between align-items-center mb-16"
            v-if="count > 0"
          >
            <p-pagination
              :total="count"
              :perPage.sync="filter.limit"
              :current.sync="filter.page"
              size="sm"
            ></p-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { BILL_FETCH, BILL_COUNT } from '../store'
import { mapActions, mapState } from 'vuex'
import { BILL_STATUS_TAB, BILL_MAP_NAME_STATUS } from '../constants'

export default {
  name: 'BillList',
  mixins: [mixinRoute, mixinTable],
  components: { EmptySearchResult },
  data() {
    return {
      filter: {
        page: 1,
        limit: 30,
        search: '',
        search_by: 'id',
        status: '',
      },
      isFetching: false,
      statusTabs: BILL_STATUS_TAB,
    }
  },
  mounted() {
    this.filter = this.getRouteQuery()
  },
  computed: {
    ...mapState('bill', {
      count: (state) => state.count,
      bills: (state) => state.bills,
    }),

    searchPlaceholder() {
      const maptext = {
        id: 'Tìm theo mã đơn hàng',
        code: 'Tìm theo mã vận đơn',
        customer: 'Tìm theo email hoặc sđt của khách hàng',
      }

      return maptext[this.filter.search_by] || maptext['id']
    },
  },
  filters: {
    statusText(val) {
      return (BILL_MAP_NAME_STATUS[val] || {}).value || 'unknown'
    },
    statusClass(val) {
      return (BILL_MAP_NAME_STATUS[val] || {}).class || 'badge-default'
    },
  },
  methods: {
    ...mapActions('bill', {
      fetchHandle: BILL_FETCH,
      countHandle: BILL_COUNT,
    }),

    async init() {
      this.handleUpdateRouteQuery()

      this.isFetching = true

      const res = await Promise.all([
        this.fetchHandle(this.filter),
        this.countHandle(this.filter),
      ])

      this.isFetching = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }
    },

    handleSearch(e) {
      this.filter.search = e.target.value
      this.filter.page = 1
      this.init()
    },
  },
  watch: {
    'filter.status': function() {
      this.filter.page = 1
      this.init()
    },
    'filter.page': function() {
      this.init()
    },
    'filter.search_by': function() {
      if (this.filter.search != '') {
        this.filter.page = 1
        this.init()
      }
    },
  },
}
</script>
