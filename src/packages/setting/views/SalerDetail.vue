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
                  v-if="topCustomers.length"
                  type="pie"
                  width="450"
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
              <div
                class="customer-note-block"
                v-html="getNoteCustomerBlock"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-block" style="padding-top: 0">
        <div class="card-body">
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="customers.length">
            <div class="table-responsive">
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
                      <router-link
                        class="text-no-underline"
                        :to="{
                          name: 'user-detail',
                          params: {
                            id: item.id,
                          },
                        }"
                      >
                        U{{ item.id }}
                      </router-link>
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
                        :config="calStarsRating(item.tickets, i)"
                      ></stars-rating>
                      <total-feedback :tickets="item.tickets"></total-feedback>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <empty-search-result v-else></empty-search-result>
          <div
            class="d-flex justify-content-between align-items-center"
            v-if="customerCount > 0"
          >
            <p-pagination
              :total="customerCount"
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
      customers: (state) => state.customers || [],
      countCustomers: (state) => state.countCustomers,
      totalRevenue: (state) => state.totalRevenue,
      topCustomers: (state) => state.topCustomers || [],
      getNoteCustomerBlock() {
        if (!this.newCustomer) {
          return `Chưa có khách hàng mới trong tuần`
        }
        return (
          '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
          '<path d="M10.8332 6.5237V16.6667H9.16658V6.5237L4.69657 10.9937L3.51807 9.81518L9.99992 3.33334L16.4817 9.81518L15.3032 10.9937L10.8332 6.5237Z" fill="#48BE78"/>\n' +
          '</svg>' +
          `<span class='up-trend'>Tăng ${this.newCustomer} khách hàng mới</span> so với tuần trước`
        )
      },
    }),
  },
  data() {
    return {
      filter: {
        limit: 30,
        page: 1,
      },
      isFetching: false,
      customerCount: 0,
      newCustomer: 0,
      series: [44, 55, 13, 43, 22],
      chartOptions: {},
      config: [],
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
      const payload = Object.assign({}, this.filter, { id: this.userID })
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
      this.chartOptions = {
        labels: this.topCustomers.map((i) => i.full_name),
        responsive: [
          {
            breakpoint: 1500,
            options: {
              chart: {
                width: 340,
                height: '120%',
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      }
    },
    async loadCustomers() {
      this.isFetching = true
      const payload = Object.assign({}, this.filter, { id: this.userID })
      let r = await this[FETCH_CUSTOMER_SALER](payload)
      this.isFetching = false
      if (r.error) {
        this.$toast.error(r.errorMessage)
        return
      }
    },
    calStarsRating(tickets, i) {
      const ticketRatedCount = tickets
        ? tickets.filter((i) => i.rating > 0).length
        : 0
      const total = tickets
        ? tickets.reduce(function (a, b) {
            return b.rating > 0 ? a + b.rating : a
          }, 0)
        : 0
      this.config[i] = {
        rating: ticketRatedCount ? total / ticketRatedCount : 0,
        isIndicatorActive: false,
        style: {
          fullStarColor: '#FAAD14',
          emptyStarColor: '#aba9a9',
          starWidth: 20,
          starHeight: 20,
        },
      }
      return this.config[i]
    },
  },
  watch: {
    filter: {
      handler: function () {
        if (this.isFetching) {
          return
        }
        this.loadCustomers()
      },
      deep: true,
    },
  },
}
</script>
