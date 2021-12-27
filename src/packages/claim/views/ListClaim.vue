<template>
  <div class="pages list__claim">
    <div class="page-content">
      <div class="d-flex list__claim-search mb-12">
        <p-input
          placeholder="Tìm theo mã vận đơn"
          prefixIcon="search"
          type="search"
          clearable
          :value.sync="filter.search"
          @keyup.enter="handleSearch"
        >
        </p-input>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="list__claim-list">
            <status-tab
              v-model="filter.status"
              :status="claimStatus"
              :count="totalCount"
            />
            <vcl-table class=" md-20" v-if="isFetching"></vcl-table>
            <template v-else-if="listclaim.length > 0">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr class="list__claim-title">
                      <th>MÃ KHIẾU NẠI</th>
                      <th>MÃ VẬN ĐƠN </th>
                      <th>TIÊU ĐỀ</th>
                      <th>NGƯỜI XỬ LÝ</th>
                      <th>NGÀY TẠO</th>
                      <th>NGÀY CẬP NHẬT GẦN NHẤT</th>
                      <th>TRẠNG THÁI </th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="(item, i) in listclaim" :key="i">
                      <td>
                        <router-link
                          class="text-no-underline"
                          :to="{
                            name: 'claim-detail',
                            params: { id: item.id },
                          }"
                        >
                          {{ item.id }}
                        </router-link>
                      </td>
                      <td>
                        <router-link
                          class="text-no-underline"
                          :to="{
                            name: 'package-detail',
                            params: { id: item.package.id },
                          }"
                        >
                          {{
                            item.package.package_code
                              ? item.package.package_code.code
                              : ''
                          }}
                        </router-link>
                      </td>
                      <td width="150">
                        <p-tooltip
                          :label="item.title"
                          size="large"
                          position="top"
                          type="dark"
                          :active="item.title.length > 15"
                        >
                          {{ truncate(item.title, 15) }}
                        </p-tooltip>
                      </td>
                      <td>{{ handler(item) }}</td>
                      <td>{{ item.created_at | datetime('dd/MM/yyyy') }}</td>
                      <td>{{ item.updated_at | datetime('dd/MM/yyyy') }}</td>
                      <td>
                        <span
                          v-status:status="converStatus(item.status)"
                        ></span>
                      </td>
                      <td width="40">
                        <router-link
                          v-if="item.status_rep == claimCustomerReply"
                          class="text-no-underline"
                          :to="{
                            name: 'claim-detail',
                            params: { id: item.id },
                          }"
                        >
                          <p-svg name="messenger"></p-svg>
                        </router-link>
                      </td>
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
import EmptySearchResult from '../../../components/shared/EmptySearchResult'
import { CLAIM_STATUS, CLAIM_CUSTOMER_REPLY } from '../constants'
import { truncate } from '@core/utils/string'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { FETCH_CLAIMS } from '../store'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ListClaim',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
  },
  data() {
    return {
      filter: {
        limit: 30,
        search: '',
        status: '',
      },
      isFetching: false,
      claimStatus: CLAIM_STATUS,
      claimCustomerReply: CLAIM_CUSTOMER_REPLY,
    }
  },
  created() {
    this.filter = this.getRouteQuery()
  },
  mounted() {
    this.init()
  },
  computed: {
    ...mapState('claim', {
      count: (state) => state.count,
      listclaim: (state) => state.claims,
      totalCount: (state) => state.totalCount,
    }),
  },
  methods: {
    ...mapActions('claim', [FETCH_CLAIMS]),
    truncate,
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      let result = await this[FETCH_CLAIMS](this.filter)
      if (result.error) {
        this.$toast.open({ type: 'danger', message: result.message })
        return
      }
      this.isFetching = false
    },
    handler(item) {
      return item.admin ? item.admin.full_name : ''
    },
    converStatus(status) {
      switch (status) {
        case 1:
          return 'Đang xử lý'
        case 2:
          return 'Đã xử lý'
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
