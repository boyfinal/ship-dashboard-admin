<template>
  <div class="list-packages pages">
    <div class="page-content">
      <div class="row mb-12" id="search-bar">
        <div class="col-9">
          <p-input
            placeholder="Tìm theo mã kiện hoặc nhãn kiện"
            suffixIcon="search"
            type="search"
            :value="filter.search"
            @keyup.enter="handleSearch"
          >
          </p-input>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <container-status-tab
            :has-all="false"
            :status="statusTab"
            v-model="filter.status"
            :count-status="count_status"
          />
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="containers.length">
            <div class="table-responsive">
              <table class="table table-hover" id="tbl-packages">
                <thead>
                  <tr>
                    <template>
                      <th>Mã kiện</th>
                      <th>Nhãn kiện</th>
                      <th>Ngày tạo</th>
                      <th>Ngày đóng</th>
                      <th>Số lượng đơn</th>
                      <th>Trạng thái</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in containers" :key="i">
                    <td>
                      {{ item.code }}
                    </td>
                    <td>
                      <a :href="item.label_url">{{ item.tracking_number }}</a>
                    </td>
                    <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                    <td>{{ item.updated_at | date('dd/MM/yyyy') }}</td>
                    <td>
                      {{ item.quantity }}
                    </td>
                    <td>
                      <span
                        class="badge badge-round"
                        :class="mapStatus[item.status].class"
                        >{{ mapStatus[item.status].value }}</span
                      >
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
  </div>
</template>
<script>
import ContainerStatusTab from '../components/ContainerStatusTab'
import { mapState, mapActions } from 'vuex'

import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'

import { CONTAINER_STATUS_TAB, MAP_NAME_STATUS_CONTAINER } from '../contants'
import { FETCH_LIST_CONTAINERS } from '../store'
export default {
  name: 'ListContainers',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    ContainerStatusTab,
  },
  data() {
    return {
      filter: {
        limit: 30,
        page: 1,
        status: '',
        search: '',
      },
      isFetching: false,
    }
  },
  created() {
    this.filter = this.getRouteQuery()
  },
  computed: {
    ...mapState('container', {
      containers: (state) => state.containers,
      count: (state) => state.count,
      count_status: (state) => state.count_status,
      statusTab() {
        return CONTAINER_STATUS_TAB
      },
      mapStatus() {
        return MAP_NAME_STATUS_CONTAINER
      },
    }),
  },
  methods: {
    ...mapActions('container', [FETCH_LIST_CONTAINERS]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      const result = await this[FETCH_LIST_CONTAINERS](this.filter)
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
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
