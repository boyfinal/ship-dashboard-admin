<template>
  <div class="setting saler-detail pages">
    <div class="page-header">
      <div class="sale-info d-flex">
        <div class="txt-col">
          <div>Nhân viên sale:</div>
          <div
            ><b>{{ saler.full_name }}</b></div
          >
        </div>
        <div class="txt-col">
          <div>Email:</div>
          <div>{{ saler.email }}</div>
        </div>
      </div>
    </div>
    <div class="page-content">
      <div class="row">
        <div class="col-7">
          <div class="card-block mdd-blk">
            <div class="card-header">
              <div class="card-title">Doanh thu</div>
            </div>
            <div class="card-body">
              <div class="txt-number">
                {{ totalRevenue | formatPrice }}
              </div>
              <div id="chart">
                <apexchart
                  v-if="topCustomers"
                  type="pie"
                  width="350"
                  height="100%"
                  :options="chartOptions"
                  :series="series"
                ></apexchart>
              </div>
            </div>
          </div>
        </div>
        <div class="col-5">
          <div class="card-block mdd-blk">
            <div class="card-header">
              <div class="card-title">Khách hàng</div>
            </div>
            <div class="card-body">
              <div class="txt-number"> {{ customerCount }} </div>
              <div class="customer-note-block" v-if="newCustomer">
                Tăng {{ newCustomer }} khách hàng mới so với tuần trước
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-block" style="padding-top: 0">
        <div class="card-body">
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="customers.length">
            <table class="table table-hover tbl-customers">
              <thead>
                <th>ID</th>
                <th>Tên khách hàng</th>
                <th>Email</th>
                <th>Ngày tạo</th>
                <th>Đơn hàng</th>
                <th>Doanh thu</th>
                <th>Khiếu nại</th>
                <th>Phản hồi</th>
              </thead>
              <tbody>
                <tr v-for="(item, i) in customers" :key="i">
                  <td>
                    {{ item.id }}
                  </td>
                  <td>
                    {{ item.full_name }}
                  </td>
                  <td>
                    {{ item.email }}
                  </td>
                  <td>
                    {{ item.created_at | date('dd/MM/yyyy') }}
                  </td>
                  <td>
                    {{ item.total_package }}
                  </td>
                  <td>
                    {{ item.revenue | formatPrice }}
                  </td>
                  <td>
                    {{ item.tickets ? item.tickets.length : 0 }}
                  </td>
                  <td>
                    <stars-rating
                      :config="calStarsRating(item.tickets)"
                    ></stars-rating>
                    <total-feedback></total-feedback>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
          <empty-search-result v-else></empty-search-result>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { truncate } from '@core/utils/string'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import {
  FETCH_CUSTOMER_SALER,
  FETCH_DETAIL_SALER,
  FETCH_REVENUE_SALER,
} from '../store'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import starsRating from '../components/rating-stars'
import TotalFeedback from '../components/TotalFeedback'
export default {
  name: 'SalerDetail',
  mixins: [mixinRoute, mixinTable],
  components: {
    TotalFeedback,
    EmptySearchResult,
    starsRating,
  },
  computed: {
    ...mapState('setting', {
      saler: (state) => state.saler,
      customers: (state) => state.customers,
      totalRevenue: (state) => state.totalRevenue,
      topCustomers: (state) => state.topCustomers,
    }),
  },
  data() {
    return {
      filter: {
        limit: 30,
        search: '',
        status: 2,
      },
      isFetching: false,
      customerCount: 0,
      newCustomer: 0,
      series: [44, 55, 13, 43, 22],
      chartOptions: {},
      config: {
        rating: 4.7,
        isIndicatorActive: false,
        style: {
          fullStarColor: '#ed8a19',
          emptyStarColor: '#737373',
          starWidth: 20,
          starHeight: 20,
        },
      },
    }
  },
  created() {
    this.userID = parseInt(this.$route.params.id, 10)
    this.init()
  },
  methods: {
    truncate,
    ...mapActions('setting', [
      FETCH_CUSTOMER_SALER,
      FETCH_DETAIL_SALER,
      FETCH_REVENUE_SALER,
    ]),

    async init() {
      this.isFetching = true
      const payload = {
        id: this.userID,
      }
      let [r1, r2, r3] = await Promise.all([
        this[FETCH_DETAIL_SALER](payload),
        this[FETCH_CUSTOMER_SALER](payload),
        this[FETCH_REVENUE_SALER](payload),
      ])
      this.isFetching = false
      if (r1.error || r2.error || r3.error) {
        this.$toast.error(r1.errorMessage || r2.errorMessage || r3.errorMessage)
        return
      }
      this.customerCount = r1.customer_count
      this.newCustomer = r1.new_customer_count
      this.series = this.topCustomers.map((i) => i.revenue)
      this.chartOptions = { labels: this.topCustomers.map((i) => i.full_name) }
    },
    calStarsRating(tickets) {
      let total = tickets
        ? tickets.reduce(function (a, b) {
            return a + b.rating
          }, 0)
        : 0
      this.config.rating = tickets ? total / tickets.length : 0
      return this.config
    },
  },
}
</script>
