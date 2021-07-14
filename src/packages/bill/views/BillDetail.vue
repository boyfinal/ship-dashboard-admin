<template>
  <div class="pages bill__detail ">
    <div class="page-header">
      <div class="page-header_back">
        <router-link :to="{ name: 'bill-list' }" class="text">
          <img
            src="@/assets/img/Arrow - Left Square 24px.png"
            class="page-header_back_icon"
          />

          Hóa đơn
        </router-link>
      </div>
      <div class="bill__detail-flex">
        <div class="bill__detail-info">
          <div class="bill__detail-title">Mã hóa đơn:</div>
          <div class="bill__detail-title">Ngày tạo:</div>
          <div class="bill__detail-title">Tổng hóa đơn</div>
          <div class="bill__detail-code">{{ bill.id }}</div>
          <div class="bill__detail-date">{{
            bill.created_at | date('dd/MM/yyyy HH:mm:ss')
          }}</div>
          <div class="bill__detail-status">{{ total_fee | formatPrice }}</div>
        </div>
        <div class="bill__detail-action">
          <a @click="handleRouter" href="#" class="btn btn-info ml-10">
            <span>Lịch sử thanh toán</span>
          </a>
        </div>
      </div>
    </div>
    <div class="page-content">
      <div class="row">
        <div class="col-12  item-gutters ">
          <div class="card-block ">
            <div class="card-header ">
              <div class="card-title">Phí vận đơn</div>
              <div class="card-pagi">
                <div
                  class="btn-pagi mr-2"
                  :class="{
                    'disable-next-page': filter.page <= 1,
                  }"
                  @click="previousCreateFee"
                >
                  <i class="fas fa-chevron-left"></i>
                </div>
                <div
                  class="btn-pagi"
                  :class="{
                    'disable-next-page': filter.page >= totalPageCreate,
                  }"
                  @click="nextCreateFee"
                >
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
            <div class="card-content">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Mã vận đơn</th>
                      <th>Ngày tạo</th>
                      <th>Phí giao</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in feeCreate" :key="i">
                      <td>
                        <router-link
                          class="text-no-underline"
                          :to="{
                            name: 'package-detail',
                            params: {
                              id: item.id,
                            },
                          }"
                        >
                          {{ item.id }}
                        </router-link>
                        <img class="link-icon" src="@/assets/img/external.svg"
                      /></td>
                      <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                      <td>{{ item.shipping_fee | formatPrice }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12  item-gutters ">
          <div class="card-block ">
            <div class="card-header">
              <div class="card-title">Phí phát sinh</div>
              <div class="card-pagi">
                <div
                  class="btn-pagi  mr-2"
                  :class="{
                    'disable-next-page': filterExtra.page <= 1,
                  }"
                  @click="previousExtraFee"
                >
                  <i class="fas fa-chevron-left"></i>
                </div>
                <div
                  class="btn-pagi"
                  @click="nextExtraFee"
                  :class="{
                    'disable-next-page': filterExtra.page >= totalPageExtra,
                  }"
                >
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
            <div class="card-content">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Mã vận đơn</th>
                      <th>Ngày tạo</th>
                      <th>Phí phát sinh</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in feeExtra" :key="i">
                      <td>
                        <router-link
                          class="text-no-underline"
                          :to="{
                            name: 'package-detail',
                            params: {
                              id: item.package_id,
                            },
                          }"
                        >
                          {{ item.package_id }}
                        </router-link>
                        <img class="link-icon" src="@/assets/img/external.svg"
                      /></td>
                      <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                      <td>{{ item.amount | formatPrice }}</td>
                      <td>
                        <span
                          v-if="item.status == 10"
                          v-status:status="`Chưa thanh toán`"
                        ></span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { FETCH_BILL_DETAIL, FETCH_BILL_EXTRA } from '../store'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'

export default {
  name: 'BillDetail',
  mixins: [mixinRoute, mixinTable],
  data() {
    return {
      filterExtra: {
        page: 1,
        limit: 10,
      },
      filter: {
        page: 1,
        limit: 10,
      },
      total_fee: 0,
      total_unpaid: 0,
    }
  },
  computed: {
    ...mapState('bill', {
      feeCreate: (state) => state.feeCreate,
      countCreate: (state) => state.countCreate,
      feeExtra: (state) => state.feeExtra,
      countExtra: (state) => state.countExtra,
      bill: (state) => state.bill,
    }),
    sumPaid() {
      return this.total_fee - this.total_unpaid
    },
    totalPageCreate() {
      const totalPages = Math.ceil(this.countCreate / this.filter.limit)
      return totalPages
    },
    totalPageExtra() {
      const totalPages = Math.ceil(this.countExtra / this.filterExtra.limit)
      return totalPages
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions('bill', [FETCH_BILL_DETAIL, FETCH_BILL_EXTRA]),
    async init() {
      const { id } = this.$route.params
      this.filterExtra.id = id
      this.filter.id = id
      this.isFetching = true
      this.handleUpdateRouteQuery()
      let result = await this[FETCH_BILL_DETAIL](this.filter)

      if (!result.success) {
        this.isFetching = false
        return
      }
      this.total_fee = result.total
      this.total_unpaid = result.total_unpaid
      await this[FETCH_BILL_EXTRA](this.filterExtra)

      this.isFetching = false
    },
    total(shipping_fee, extra__fee = 0, promotion = 0) {
      let totalFee = 0
      totalFee = shipping_fee + extra__fee - promotion
      return totalFee
    },
    sum(array) {
      let tt = array
        .map((item) => (item.status > 0 ? item.amount : 0))
        .reduce((previous, current) => {
          return previous + current
        }, 0)
      return tt
    },
    handleRouter() {
      const { id } = this.$route.params
      this.$router
        .push({
          name: 'list-transaction',
          query: {
            search_by: 'bill_id',
            page: 1,
            limit: 30,
            search: id,
          },
        })
        .catch()
    },
    async previousCreateFee() {
      let page =
        this.filter.page <= 1 ? (this.filter.page = 1) : (this.filter.page -= 1)
      this.$set(this.filter, 'page', page)
      await this[FETCH_BILL_DETAIL](this.filter)
    },
    async nextCreateFee() {
      let page =
        this.filter.page >= this.totalPageCreate
          ? this.filter.page
          : this.filter.page + 1
      this.$set(this.filter, 'page', page)
      await this[FETCH_BILL_DETAIL](this.filter)
    },
    async previousExtraFee() {
      let page =
        this.filterExtra.page <= 1
          ? (this.filterExtra.page = 1)
          : (this.filterExtra.page -= 1)
      this.$set(this.filterExtra, 'page', page)
      await this[FETCH_BILL_EXTRA](this.filterExtra)
    },
    async nextExtraFee() {
      let page =
        this.filterExtra.page >= this.totalPageExtra
          ? this.filterExtra.page
          : this.filterExtra.page + 1
      this.$set(this.filterExtra, 'page', page)
      await this[FETCH_BILL_EXTRA](this.filterExtra)
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
