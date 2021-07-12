<template>
  <div class="list-packages pages">
    <div class="page-content">
      <div class="row mb-12 search-input">
        <div class="col-9 pl-0">
          <p-input
            placeholder="Tìm kiếm ..."
            suffixIcon="search"
            type="search"
            :clearable="true"
            v-model="keywordSearch"
            @keyup.enter="handleSearch"
          >
          </p-input>
        </div>
        <div class="col-3">
          <p-select placeholder="Please select" v-model="filter.search_by">
            <option :value="key" v-for="(value, key) in searchBy" :key="key">
              {{ value }}
            </option>
          </p-select>
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
                      <th :class="{ hidden: hiddenClass }">Mã vận đơn</th>
                      <th :class="{ hidden: hiddenClass }">Mã đơn hàng</th>
                      <th :class="{ hidden: hiddenClass }">Người nhận</th>
                      <th :class="{ hidden: hiddenClass }"
                        >Chi tiết hàng hóa</th
                      >
                      <th width="100" :class="{ hidden: hiddenClass }"
                        >Ngày tạo
                      </th>
                      <th width="100" :class="{ hidden: hiddenClass }"
                        >Trạng thái</th
                      >
                      <th :class="{ hidden: hiddenClass }">Tổng cước</th>
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
                        :to="{
                          name: 'package-detail',
                          params: {
                            id: item.id,
                          },
                        }"
                      >
                        {{ item.code }}
                      </router-link>
                    </td>
                    <td>{{ item.order_number }}</td>
                    <td>
                      {{ item.recipient }}
                    </td>
                    <td>
                      <p-tooltip
                        :label="item.detail"
                        size="large"
                        position="top"
                        type="dark"
                        :active="item.detail.length > 15"
                      >
                        {{ truncate(item.detail, 15) }}
                      </p-tooltip>
                    </td>
                    <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                    <td>
                      <span
                        v-status:status="mapStatus[item.status].value"
                      ></span>
                    </td>
                    <td>{{ item.shipping_fee | formatPrice }}</td>
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
  PACKAGE_STATUS_TAB,
  PackageStatusInit,
  MAP_NAME_STATUS_PACKAGE,
} from '../constants'
import {
  FETCH_LIST_PACKAGES,
  IMPORT_PACKAGE,
  EXPORT_PACKAGE,
  PROCESS_PACKAGE,
  CANCEL_PACKAGES,
} from '@/packages/package/store'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'

export default {
  name: 'ListPackages',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    PackageStatusTab,
  },
  data() {
    return {
      filter: {
        limit: 50,
        status: '',
        search: '',
        search_by: 'code',
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
    }
  },
  created() {
    this.filter = this.getRouteQuery()
    this.keywordSearch = this.filter.search.trim()
    this.init()
  },
  computed: {
    ...mapState('package', {
      packages: (state) => state.packages,
      count: (state) => state.countPackages,
      count_status: (state) => state.count_status,
      hiddenClass() {
        return this.action.selected.length > 0 || this.isAllChecked
      },
      isFilterInitTab() {
        return this.filter.status === PackageStatusInit
      },
      items() {
        return this.packages
      },
    }),
    statusTab() {
      return PACKAGE_STATUS_TAB
    },
    mapStatus() {
      return MAP_NAME_STATUS_PACKAGE
    },
  },
  methods: {
    ...mapActions('package', [
      FETCH_LIST_PACKAGES,
      IMPORT_PACKAGE,
      EXPORT_PACKAGE,
      PROCESS_PACKAGE,
      CANCEL_PACKAGES,
    ]),
    truncate,
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      this.keywordSearch = this.filter.search.trim()
      const result = await this.fetchListPackages(this.filter)
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

<style></style>
