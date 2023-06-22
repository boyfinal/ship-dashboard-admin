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
        <div class="col-4">
          <div class="card-block mdd-blk">
            <div class="card-header">
              <div class="card-title">Doanh thu</div>
            </div>
            <div class="card-body">
              <div class="txt-number">
                {{ totalRevenue | formatPrice }}
              </div>
              <el-date-picker
                v-model="month"
                type="monthrange"
                range-separator="~"
                start-placeholder="Start month"
                end-placeholder="End month"
                @change="changeSelectMonth()"
              >
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card-block mdd-blk">
            <div class="card-header">
              <div class="card-title">Top 5 Doanh thu</div>
            </div>
            <div class="card-body">
              <div id="chart">
                <apexchart
                  v-if="topCustomers.length"
                  type="pie"
                  height="100%"
                  :options="chartOptions"
                  :series="series"
                ></apexchart>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card-block mdd-blk">
            <div class="card-header">
              <div class="card-title">Khách hàng</div>
            </div>
            <div class="card-body">
              <div class="txt-number"> {{ customerCount }} </div>
            </div>
          </div>
        </div>
      </div>
      <h3>Khách hàng đã có doanh thu</h3>
      <div class="card-block" style="padding-top: 0">
        <div class="card-body">
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="revenueCus.length">
            <div class="">
              <table class="table table-hover tbl-customers">
                <thead>
                  <th>ID</th>
                  <th>Tên khách hàng</th>
                  <th>Email</th>
                  <th>Ngày tạo</th>
                  <th>Đơn hàng</th>
                  <th>Doanh thu</th>
                  <th
                    >Khiếu nại
                    <router-link
                      class="text-no-underline"
                      :to="{
                        name: 'list-claim',
                        query: {
                          search_by: 'recipient',
                          search: saler.full_name,
                        },
                      }"
                    >
                      <p-svg name="link_to" style="margin-top: -2px"></p-svg
                    ></router-link>
                  </th>
                  <th>Phản hồi</th>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in revenueCus" :key="i">
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
                    <td :title="item.email" class="txt-eclipse">
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
                      {{ countAllTickets(item.tickets) }}
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
            v-if="countRevenueCus > 0"
          >
            <p-pagination
              :total="countRevenueCus"
              :perPage.sync="filter.limit"
              :current.sync="filter.page"
              size="sm"
            ></p-pagination>
          </div>
        </div>
      </div>
      <h3>Khách hàng chưa có doanh thu</h3>
      <div class="card-block" style="padding-top: 0">
        <div class="card-body">
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="noneRevenueCus.length">
            <div class="">
              <table class="table table-hover tbl-customers">
                <thead>
                  <th>ID</th>
                  <th>Tên khách hàng</th>
                  <th>Email</th>
                  <th>Ngày tạo</th>
                  <th>Đơn hàng</th>
                  <th>Doanh thu</th>
                  <th
                    >Khiếu nại
                    <router-link
                      class="text-no-underline"
                      :to="{
                        name: 'list-claim',
                        query: {
                          search_by: 'recipient',
                          search: saler.full_name,
                        },
                      }"
                    >
                      <p-svg name="link_to" style="margin-top: -2px"></p-svg
                    ></router-link>
                  </th>
                  <th>Phản hồi</th>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in noneRevenueCus" :key="i">
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
                    <td :title="item.email" class="txt-eclipse">
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
            v-if="countNoneRevenueCus > 0"
          >
            <p-pagination
              :total="countNoneRevenueCus"
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
      countCustomers: (state) => state.countCustomers,
      totalRevenue: (state) => state.totalRevenue,
      topCustomers: (state) => state.topCustomers || [],
    }),
  },
  data() {
    return {
      filter: {
        limit: 30,
        page: 1,
      },
      month: '',
      isFetching: false,
      customerCount: 0,
      newCustomer: 0,
      revenueCus: [],
      noneRevenueCus: [],
      countRevenueCus: 0,
      countNoneRevenueCus: 0,
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
      const p1 = Object.assign({}, this.filter, {
        id: this.userID,
        is_revenue: true,
      })
      const p2 = Object.assign({}, p1, { id: this.userID, is_revenue: false })
      let [r1, r2, r3, r4] = await Promise.all([
        this[FETCH_DETAIL_SALER](p1),
        this[FETCH_CUSTOMER_SALER](p1),
        this[FETCH_REVENUE_SALER](p1),
        this[FETCH_CUSTOMER_SALER](p2),
      ])
      this.isFetching = false
      if (r1.error || r2.error || r3.error || r4.error) {
        this.$toast.error(
          r1.errorMessage ||
            r2.errorMessage ||
            r3.errorMessage ||
            r4.errorMessage
        )
        return
      }
      this.revenueCus = r2.customers || []
      this.countRevenueCus = r2.count
      this.noneRevenueCus = r4.customers || []
      this.countNoneRevenueCus = r4.count
      this.customerCount = r1.customer_count
      this.series = this.topCustomers.map((i) => i.revenue)
      this.chartOptions = {
        labels: this.topCustomers.map((i) => i.full_name),
        legend: {
          show: true,
          position: 'top',
        },
        responsive: [
          {
            breakpoint: 1500,
            options: {
              chart: {
                height: '120%',
              },
              legend: {
                position: 'top',
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
    changeSelectMonth() {
      console.log(this.month[0].toLocaleDateString('en-US'))
    },
    countAllTickets(ts) {
      return ts
        ? ts.reduce(function (a, b) {
            return a + b.count
          }, 0)
        : 0
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
<style scoped>
.txt-eclipse {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
