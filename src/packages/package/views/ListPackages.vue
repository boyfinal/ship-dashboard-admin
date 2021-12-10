<template>
  <div class="list-packages pages">
    <div class="page-content">
      <div class="d-flex jc-sb mb-12 search-input">
        <p-input
          :placeholder="searchPlaceholder"
          prefixIcon="search"
          type="search"
          :clearable="true"
          :value.sync="keywordSearch"
          @keyup.enter="handleSearch"
          @clear="clearSearch"
        >
        </p-input>
        <p-select
          class="ml-8"
          style="width:20%"
          placeholder="Please select"
          v-model="filter.search_by"
        >
          <option :value="key" v-for="(value, key) in searchBy" :key="key">
            {{ value }}
          </option>
        </p-select>
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
                  <div
                    class="bulk-actions d-flex align-items-center"
                    v-if="totalSelected > 0"
                  >
                    <div class="bulk-actions__main-bar">
                      <span class="bulk-actions__selection-count">{{
                        selectionCountText
                      }}</span>
                      <p-button
                        class="bulk-actions__selection-status"
                        @click="handleExport"
                        >Xuất Excel</p-button
                      >
                    </div>
                  </div>
                  <tr>
                    <th width="40">
                      <p-checkbox
                        class="order-select-checkbox"
                        :class="{ checkAll: totalSelected > 0 }"
                        :style="totalSelected > 0 && { width: 0 }"
                        :value="isAllChecked"
                        @change.native="toggleSelectAll"
                        :indeterminate="isIndeterminate"
                      ></p-checkbox>
                    </th>
                    <template>
                      <th :class="{ hidden: hiddenClass }">Mã vận đơn</th>
                      <th :class="{ hidden: hiddenClass }">Mã đơn hàng</th>
                      <th :class="{ hidden: hiddenClass }">Tracking</th>
                      <th :class="{ hidden: hiddenClass }">Khách hàng</th>
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
                    :class="{
                      hover: isChecked(item),
                      deactive:
                        item.package_code &&
                        item.package_code.status == PackageStatusDeactive,
                    }"
                  >
                    <td width="40">
                      <p-checkbox
                        v-model="action.selected"
                        :native-value="item"
                        @input="handleValue($event)"
                      ></p-checkbox>
                    </td>
                    <td class="text-nowrap code">
                      <span class="">
                        <router-link
                          class="text-no-underline"
                          :to="{
                            name: 'package-detail',
                            params: {
                              id: item.id,
                            },
                          }"
                          v-if="item.package_code"
                        >
                          {{ item.package_code.code }}
                        </router-link>
                        <span
                          v-if="!item.validate_address"
                          @click="handleValidateAddress(item.id)"
                          class="
                            list-warning
                            badge badge-round badge-warning-order
                          "
                        >
                          <p-tooltip
                            class="item_name"
                            :label="`Địa chỉ không hợp lệ`"
                            position="top"
                            type="dark"
                          >
                            <i aria-hidden="true"
                              ><img src="@assets/img/warning.svg" />
                            </i>
                          </p-tooltip>
                        </span>
                      </span>

                      <span class="svg">
                        <p-tooltip
                          class="item_name"
                          :label="` Track `"
                          position="top"
                          type="dark"
                        >
                          <a
                            target="_blank"
                            :href="
                              `https://t.17track.net/en#nums=${
                                item.package_code ? item.package_code.code : ''
                              }`
                            "
                          >
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 32 32"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="16" cy="16" r="16" fill="none" />
                              <g clip-path="url(#clip0_382_4459)">
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M12.0682 18.9542L8.14707 17.6451C7.95102 17.5204 7.95102 17.3957 8.14707 17.2711L23.4723 8.04502C23.6356 7.95151 23.701 8.01385 23.7337 8.13853L23.9951 22.5074C24.0278 22.7568 23.8971 22.8815 23.6356 22.7568L18.2114 20.9802L16.4795 23.9101C16.4142 24.0347 16.2508 24.0347 16.2508 23.8789L15.7607 20.0763L21.7404 11.5671L14.8784 18.2373C14.1268 18.9542 13.2119 19.2035 12.0682 18.9542Z"
                                  fill="#313232"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_382_4459">
                                  <rect
                                    width="16"
                                    height="16"
                                    fill="white"
                                    transform="translate(8 8)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                          </a>
                        </p-tooltip>
                      </span>
                    </td>
                    <td>{{ item.order_number }}</td>
                    <td class="text-nowrap">
                      <a
                        v-if="item.tracking"
                        target="_blank"
                        class="on-hover"
                        :href="
                          `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${item.tracking.tracking_number}`
                        "
                      >
                        {{ item.tracking.tracking_number }}
                      </a>
                    </td>
                    <td>
                      {{ item.user.full_name }}
                    </td>
                    <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                    <td>
                      <span
                        v-status:status="mapStatus[item.status_string].value"
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
    <modal-export :visible="isVisibleExport"> </modal-export>
  </div>
</template>
<script>
import PackageStatusTab from '../components/PackageStatusTab'
import { mapState, mapActions } from 'vuex'
import { truncate } from '@core/utils/string'
import mixinDownload from '@/packages/shared/mixins/download'
import ModalExport from '../components/ModalExport'

import {
  PACKAGE_STATUS_TAB,
  PackageStatusCreatedText,
  MAP_NAME_STATUS_STRING_PACKAGE,
  PackageStatusDeactive,
} from '../constants'
import {
  FETCH_LIST_PACKAGES,
  IMPORT_PACKAGE,
  EXPORT_PACKAGE,
  PROCESS_PACKAGE,
  CANCEL_PACKAGES,
} from '../store'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'

export default {
  name: 'ListPackages',
  mixins: [mixinRoute, mixinTable, mixinDownload],
  components: {
    EmptySearchResult,
    PackageStatusTab,
    ModalExport,
  },
  data() {
    return {
      filter: {
        limit: 30,
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
      isVisibleExport: false,
      selected: [],
      searchBy: {
        code: 'Mã vận đơn',
        order_number: 'Mã đơn hàng',
        recipient: 'Người nhận',
        account: 'Tài khoản khách hàng',
        customer_full_name: 'Tên khách hàng',
        tracking: 'Mã tracking',
      },
      PackageStatusDeactive: PackageStatusDeactive,
    }
  },
  created() {
    this.filter = this.getRouteQuery()
    this.keywordSearch = this.filter.search.trim()
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
        return this.filter.status_string === PackageStatusCreatedText
      },
      items() {
        return this.packages
      },
    }),
    showDetailPackage() {
      return !this.$isAccountant() && !this.$isSupport()
    },
    statusTab() {
      return PACKAGE_STATUS_TAB
    },
    mapStatus() {
      return MAP_NAME_STATUS_STRING_PACKAGE
    },
    searchPlaceholder() {
      const maptext = {
        id: 'Tìm theo mã hoá đơn',
        code: 'Tìm theo mã vận đơn',
        recipient: 'Tìm theo tên người nhận',
        account: 'Tìm theo email hoặc sđt của khách hàng',
        order_number: 'Tìm theo mã đơn hàng',
        customer: 'Tìm theo email hoặc sđt của khách hàng',
        customer_full_name: 'Tìm theo tên khách hàng',
        tracking: 'Tìm theo mã tracking',
      }

      return maptext[this.filter.search_by] || maptext['id']
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
      const result = await this[FETCH_LIST_PACKAGES](this.filter)
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
    },
    handleValue(e) {
      this.selected = JSON.parse(JSON.stringify(e))
    },
    async handleExport() {
      this.isVisibleExport = true
      const result = await this[EXPORT_PACKAGE]({
        ids: this.selectedIds,
      })
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        this.isVisibleExport = false
        return
      }
      this.downloadFile(
        result.url,
        'packages',
        result.url.split('/'),
        'danh_sach_van_don_'
      )
      this.isVisibleExport = false
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

<style scoped lang="scss">
.p-tooltip::after {
  width: auto !important;
  white-space: pre;
}
.deactive {
  td {
    opacity: 0.6;
  }
}
.code {
  display: flex;
  align-items: center;
}
</style>
