<template>
  <div class="pages list__claim">
    <div class="page-content">
      <div class="d-flex jc-sb mb-12">
        <div
          class="d-flex"
          style="
    width: 84%;
"
        >
          <p-input
            :placeholder="searchPlaceholder"
            prefixIcon="search"
            type="search"
            clearable
            v-model="filter.search"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          >
          </p-input>
          <div class="ml-8">
            <select v-model="filter.search_by" class="form-control">
              <option value="bill_code">Mã hoá đơn</option>
              <option value="code">Lionbay tracking</option>
              <option value="customer">Tài khoản Khách hàng</option>
              <option value="customer_full_name">Tên Khách hàng</option>
              <option value="tracking">Last mile tracking</option>
            </select>
          </div>
        </div>

        <div
          v-if="user.role == ROLE_ADMIN || user.role == ROLE_ACCOUNTANT"
          class="ml-8"
        >
          <p-button type="info" @click="handleShowModalCreateExtraFee">
            <svgicon name="plus" class="text-white" />
            Tạo phí phát sinh
          </p-button>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="list__bill-list">
            <vcl-table class="md-20" v-if="isFetching"></vcl-table>
            <template v-else-if="bills.length > 0">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr class="list__claim-title">
                      <th>MÃ HÓA ĐƠN</th>
                      <th>KHÁCH HÀNG</th>
                      <th>NGÀY TẠO</th>
                      <th>TỔNG HÓA ĐƠN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in transBills" :key="item.id">
                      <td>
                        <router-link
                          class="text-no-underline"
                          :to="{
                            name: 'bill-detail',
                            params: { code: item.code },
                          }"
                        >
                          {{ item.code }}
                        </router-link>
                      </td>
                      <td>{{ item.customer }}</td>
                      <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                      <td> {{ item.total_amount | formatPrice }} </td>
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
    <modal-create-extra-fee
      :types="fee_types"
      :visible.sync="visibleCreateExtraFeeModal"
      :loading="isSubmitting"
      @save="handleSubmitExtraFee"
    >
    </modal-create-extra-fee>
  </div>
</template>
<script>
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import {
  BILL_FETCH,
  BILL_COUNT,
  FETCH_FEE_EXTRA_TYPES,
  CREATE_EXTRA_FEE,
} from '../store'
import { mapActions, mapState } from 'vuex'
import { BILL_MAP_NAME_STATUS } from '../constants'
import ModalCreateExtraFee from '../components/ModalCreateExtraFee'
import { ROLE_ADMIN, ROLE_ACCOUNTANT } from '@core/constants'

export default {
  name: 'BillList',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    ModalCreateExtraFee,
  },
  data() {
    return {
      filter: {
        page: 1,
        limit: 30,
        search: '',
        search_by: 'bill_code',
        status: '',
      },
      isSubmitting: false,
      visibleCreateExtraFeeModal: false,
      isFetching: false,
      ROLE_ADMIN: ROLE_ADMIN,
      ROLE_ACCOUNTANT: ROLE_ACCOUNTANT,
    }
  },
  mounted() {
    this.filter = this.getRouteQuery()
    this.init()
  },
  computed: {
    ...mapState('bill', {
      count: (state) => state.count,
      bills: (state) => state.bills,
      fee_types: (state) => state.extraFeeTypes,
    }),
    ...mapState('shared', {
      user: (state) => state.user,
    }),

    transBills() {
      return this.bills.map((item) => {
        let user = 'unknown'
        if (item.user) {
          const username = item.user.email || item.user.phone_number
          if (item.user.full_name) {
            user = `${item.user.full_name}-${username}`
          } else {
            user =
              item.user.email && item.user.phone_number
                ? `${item.user.email}-${item.user.phone_number}`
                : username
          }
        }

        return {
          code: item.code,
          customer: user,
          created_at: item.created_at,
          total_amount: item.shipping_fee + item.extra_fee,
        }
      })
    },
    searchPlaceholder() {
      const maptext = {
        bill_code: 'Tìm theo mã hoá đơn',
        code: 'Tìm theo LionBay tracking',
        customer: 'Tìm theo email hoặc sđt của khách hàng',
        customer_full_name: 'Tìm theo tên khách hàng',
        tracking: 'Tìm theo last mile tracking',
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
      fetchFeeType: FETCH_FEE_EXTRA_TYPES,
      createExtraFee: CREATE_EXTRA_FEE,
    }),

    async init() {
      this.filter.limit = this.filter.limit != 30 ? 30 : this.filter.limit
      this.handleUpdateRouteQuery()

      this.isFetching = true

      const res = await Promise.all([
        this.fetchHandle(this.filter),
        this.countHandle(this.filter),
        this.fetchFeeType(),
      ])

      this.isFetching = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }
    },
    async handleSubmitExtraFee(payload) {
      this.isSubmitting = true
      const result = await this.createExtraFee(payload)
      this.isSubmitting = false
      this.visibleCreateExtraFeeModal = false
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
        })
        return
      }

      this.$toast.open({
        type: 'success',
        message: 'Tạo phí phát sinh thành công',
      })
      this.init()
    },
    handleSearch() {
      this.filter.page = 1
      this.init()
    },
    handleShowModalCreateExtraFee() {
      this.visibleCreateExtraFeeModal = true
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
