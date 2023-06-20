<template>
  <div class="pages list__product">
    <div class="search-input">
      <p-input
        placeholder="Tìm kiếm theo tên hoặc email"
        prefixIcon="search"
        class="mb-2"
        type="search"
        :value="filter.search"
        @keyup.enter="handleSearch"
        :clearable="true"
        @clear="clearSearch"
      >
      </p-input>
    </div>
    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <vcl-table class="md-20" v-if="isFetching"></vcl-table>
          <template v-else-if="sales.length > 0">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr class="list__product-title">
                    <th>TÊN</th>
                    <th>EMAIL</th>
                    <th>SỐ KHÁCH HÀNG</th>
                    <th>SỐ TICKET</th>
                    <th>DOANH THU</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="item in sales" :key="item.id">
                    <td>
                      <router-link
                        class="text-no-underline"
                        :to="{
                          name: 'saler-detail',
                          params: {
                            id: item.id,
                          },
                        }"
                      >
                        {{ item.full_name }}
                      </router-link>
                    </td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.count_customer | formatNumberV2 }}</td>
                    <td>{{ item.count_ticket | formatNumberV2 }}</td>
                    <td>{{ item.revenue | formatPrice }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <EmptySearchResult v-else></EmptySearchResult>
        </div>
      </div>
      <div
        class="d-flex justify-content-between align-items-center mb-80 paginate"
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
</template>
<script>
import { mapActions, mapState } from 'vuex'
import EmptySearchResult from '../../../components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { FETCH_LIST_SALES, FETCH_COUNT_SALES } from '../store'

export default {
  name: 'ListSales',
  mixins: [mixinRoute, mixinTable],
  components: { EmptySearchResult },
  computed: {
    ...mapState('setting', {
      sales: (state) => state.sales,
      count: (state) => state.count_sales,
    }),
  },
  data() {
    return {
      filter: {
        search: '',
        limit: 25,
      },
      isFetching: false,
    }
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('setting', {
      fetchList: FETCH_LIST_SALES,
      fetchCount: FETCH_COUNT_SALES,
    }),
    async init() {
      this.handleUpdateRouteQuery()
      this.isFetching = true

      const filter = { ...this.filter }

      this.fetchCount(filter)
      const res = await this.fetchList(filter)

      this.isFetching = false

      if (res.error) {
        this.$toast.error(res.message)
      }
    },
  },
  watch: {
    filter: {
      handler: function () {
        this.init()
      },
      deep: true,
    },
  },
}
</script>
