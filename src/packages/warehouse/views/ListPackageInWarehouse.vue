<template>
  <div class="list-packages pages">
    <div class="page-content">
      <div class="row mb-12 search-input">
        <div class="col-12 pl-0">
          <p-input
            placeholder="Tìm theo mã vận đơn ..."
            prefixIcon="search"
            type="search"
            clearable
            v-model="keywordSearch"
            @keyup.enter="handleSearch"
            @clear="clearSearch"
          >
          </p-input>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <package-status-tab
            :has-all="false"
            :status="statusTab"
            v-model="filter.status"
            :count-status="count_status"
          />
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="packages.length">
            <div class="table-responsive">
              <table class="table table-hover" id="tbl-packages">
                <thead>
                  <tr>
                    <template>
                      <th>Mã vận đơn</th>
                      <th>Trạng thái</th>
                      <th>Thành phố</th>
                      <th>Mã bang</th>
                      <th>Mã bưu điện </th>
                      <th width="100">Dịch vụ</th>
                      <th>Nhãn đơn</th>
                      <th>Nhãn kiện</th>
                      <th>Mã kiện</th>
                      <th>Mã lô</th>
                      <th></th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in packages"
                    :key="i"
                    :class="{ hover: isChecked(item) }"
                  >
                    <td>
                      <router-link
                        class="text-no-underline"
                        v-if="admin"
                        :to="{
                          name: 'package-detail',
                          params: {
                            id: item.id,
                          },
                        }"
                      >
                        {{ item.code }}
                      </router-link>
                      <span v-else class="text-no-underline">{{
                        item.code
                      }}</span>
                    </td>
                    <td
                      ><span v-status="mapStatus[item.status].value"></span
                    ></td>
                    <td>
                      {{ item.city }}
                    </td>
                    <td> {{ item.state_code }} </td>
                    <td>{{ item.zipcode }}</td>
                    <td>{{ item.service_name }}</td>
                    <td>
                      <router-link
                        class="text-no-underline"
                        v-if="item.tracking && item.tracking.length > 0"
                        :to="`${item.tracking[0].label_url}`"
                      >
                        {{ item.tracking[0].tracking_number }}
                      </router-link>
                    </td>
                    <td
                      ><router-link
                        class="text-no-underline"
                        v-if="item.container_id"
                        :to="`${item.container_label_url}`"
                      >
                        {{ item.container_tracking_number }}
                      </router-link></td
                    >
                    <td>
                      {{ item.container_code || '-' }}
                    </td>
                    <td>
                      {{ item.shipment_id || '-' }}
                    </td>
                    <td>
                      <div>
                        <p-button
                          v-if="item.status == PackageWareHouseStatusPick"
                          @click="acceptHandle(item.code)"
                          class="mr-2"
                          type="info"
                        >
                          Kiểm hàng
                        </p-button>
                      </div>
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
                :total="count"
                :fixed-limit="true"
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
import PackageStatusTab from '../components/PackageStatusTab'
import { mapState, mapActions } from 'vuex'
import { truncate } from '@core/utils/string'

import {
  PACKAGE_IN_WAREHOUSE_STATUS_TAB,
  MAP_NAME_STATUS_PACKAGE,
  PACKAGE_WAREHOUSE_STATUS_PICK,
  PACKAGE_WAREHOUSE_STATUS_RETURN,
} from '../constants'
import { FETCH_LIST_PACKAGES_IN_WAREHOUSE } from '../store'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'

export default {
  name: 'ListPackageInWarehouse',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    PackageStatusTab,
  },
  data() {
    return {
      filter: {
        limit: 30,
        status: '',
        search: '',
        code: '',
      },
      labelDate: `Tìm theo ngày`,
      isUploading: false,
      resultImport: {},
      keywordSearch: '',
      allowSearch: true,
      isFetching: false,
      isVisibleConfirmWayBill: false,
      visibleConfirmCancel: false,
      selected: [],
      searchBy: {
        code: 'Mã vận đơn',
        order_number: 'Mã đơn hàng',
        recipient: 'Người nhận',
        account: 'Tài khoản khách',
      },
      PackageWareHouseStatusPick: PACKAGE_WAREHOUSE_STATUS_PICK,
      PackageWareHouseStatusReturn: PACKAGE_WAREHOUSE_STATUS_RETURN,
    }
  },
  created() {
    this.filter = this.getRouteQuery()
    this.keywordSearch = this.filter.search.trim()
    this.init()
  },
  computed: {
    ...mapState('warehouse', {
      packages: (state) => state.packages_in_warehouse,
      count: (state) => state.count_packages_in_warehouse,
      count_status: (state) => state.count_status,
      hiddenClass() {
        return this.action.selected.length > 0 || this.isAllChecked
      },
      isFilterInitTab() {
        return this.filter.status === PACKAGE_WAREHOUSE_STATUS_PICK
      },
      items() {
        return this.packages
      },
      admin() {
        return this.$isAdmin()
      },
    }),
    statusTab() {
      return PACKAGE_IN_WAREHOUSE_STATUS_TAB
    },
    mapStatus() {
      return MAP_NAME_STATUS_PACKAGE
    },
  },
  methods: {
    ...mapActions('warehouse', [FETCH_LIST_PACKAGES_IN_WAREHOUSE]),
    truncate,
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      this.keywordSearch = this.filter.search.trim()
      const result = await this[FETCH_LIST_PACKAGES_IN_WAREHOUSE](this.filter)
      this.isFetching = false
      if (!result || !result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
    },
    acceptHandle(code) {
      this.$router.push({ name: 'check-package', query: { keyword: code } })
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

<style></style>
