<template>
  <div class="list-packages pages">
    <div class="page-content">
      <div class="d-flex jc-sb mb-12 search-input">
        <div class="group d-flex">
          <p-input
            :placeholder="searchPlaceholder"
            prefixIcon="search"
            type="search"
            :clearable="true"
            v-model="keywordSearch"
            @input="checkClearSearch"
            @keyup.enter="handleSearch"
            @clear="clearSearch"
          >
          </p-input>
          <p-select
            class="ml-8"
            style="width: auto"
            placeholder="Please select"
            v-model="filter.search_by"
          >
            <option :value="key" v-for="(value, key) in searchBy" :key="key">
              {{ value }}
            </option>
          </p-select>
        </div>

        <div class="d-flex date-search">
          <p-datepicker
            :format="'dd/mm/yyyy'"
            class="p-input-group input-group"
            @update="selectDate"
            :label="labelDate"
            id="date-search"
            :value="{
              startDate: filter.start_date,
              endDate: filter.end_date,
            }"
            @clear="clearSearchDate"
          ></p-datepicker>
        </div>
        <div class="ml-8">
          <p-select
            class="ml-8"
            style="width: auto"
            :placeholder="`Tìm theo kho`"
            v-model="filter.warehouse"
          >
            <option
              :value="item.id"
              v-for="(item, key) in wareHouses"
              :key="key"
            >
              {{ item.name }}
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
            <div class="table-responsive" style="overflow: unset">
              <table class="table table-hover table-packages" id="tbl-packages">
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
                      <th :class="{ hidden: hiddenClass }">order no.</th>
                      <th :class="{ hidden: hiddenClass }">lionbay tracking</th>
                      <th :class="{ hidden: hiddenClass }"
                        >last mile tracking</th
                      >
                      <th :class="{ hidden: hiddenClass }">customer</th>
                      <th width="100" :class="{ hidden: hiddenClass }"
                        >created date
                      </th>
                      <th width="150" :class="{ hidden: hiddenClass }"
                        >status</th
                      >
                      <th :class="{ hidden: hiddenClass }">Total fee</th>
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
                        (item.package_code &&
                          item.package_code.status ==
                            PackageStatusDeactivate) ||
                        item.status_string == PackageStatusExpiredText,
                    }"
                  >
                    <td width="40">
                      <p-checkbox
                        v-model="action.selected"
                        :native-value="item"
                        @input="handleValue($event)"
                      >
                      </p-checkbox>
                    </td>
                    <td class="order-number">
                      <div class="d-flex justify-content-between">
                        <router-link
                          class="text-no-underline"
                          :to="{
                            name: 'package-detail',
                            params: {
                              id: item.id,
                            },
                          }"
                        >
                          {{ item.order_number }}
                        </router-link>
                        <span
                          v-if="!item.validate_address"
                          class="list-warning pull-right badge badge-round badge-warning-order"
                        >
                          <p-tooltip
                            class="item_name"
                            :label="`Địa chỉ không hợp lệ`"
                            position="top"
                            type="dark"
                          >
                            <p-svg name="location-warning"></p-svg>
                          </p-tooltip>
                        </span>
                      </div>
                    </td>
                    <td class="text-nowrap code">
                      <span v-if="showPackageCode(item)" class="link-code">
                        {{ item.package_code.code }}
                      </span>
                      <span
                        v-else
                        :class="{ 'no-track-code': totalSelected <= 0 }"
                      >
                        N/A
                      </span>
                      <span
                        class="svg"
                        v-if="
                          showPackageCode(item) && item.country_code != 'AU'
                        "
                      >
                        <p-tooltip
                          class="item_name"
                          :label="` Track `"
                          position="top"
                          type="dark"
                        >
                          <a
                            target="_blank"
                            :href="`https://t.17track.net/en#nums=${
                              item.package_code ? item.package_code.code : ''
                            }`"
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
                    <td class="text-nowrap">
                      <track-link v-if="item.tracking" :current="item" />
                      <span
                        :class="{ 'no-track-code': totalSelected <= 0 }"
                        v-else
                        >N/A</span
                      >
                    </td>
                    <td>
                      {{ item.user.full_name }}
                    </td>
                    <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                    <td>
                      <span v-status="item.status"></span>
                      <span
                        v-if="item.alert > 0"
                        class="pull-right list-warning badge badge-round badge-warning-order"
                      >
                        <p-tooltip
                          class="item_name"
                          :label="description(item.alert)"
                          position="top"
                          type="dark"
                        >
                          <p-svg name="warning"></p-svg>
                        </p-tooltip>
                      </span>
                    </td>
                    <td
                      class="fee"
                      v-if="item.is_package_exceed"
                      style="color: #fa8c16"
                    >
                      <span v-if="!item.shipping_fee"> Đang tính giá </span>
                      <p-tooltip
                        :label="`Hàng quá cỡ`"
                        position="top"
                        type="dark"
                        v-else
                      >
                        <span class="pkg-exceed">
                          {{ convertPrice(item) | formatPrice }}
                        </span>
                      </p-tooltip>
                    </td>
                    <td v-else>{{ convertPrice(item) | formatPrice }}</td>
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
              >
              </p-pagination>
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
import { date } from '@core/utils/datetime'
import { FETCH_WAREHOUSE } from '../../shared/store'
import {
  PACKAGE_STATUS_CREATED_TEXT,
  PACKAGE_STATUS_TAB,
  MAP_NAME_STATUS_STRING_PACKAGE,
  PACKAGE_STATUS_DEACTIVATE,
  PACKAGE_STATUS_EXPIRED_TEXT,
  PACKAGE_ALERT_TYPE_OVER_PRE_TRANSIT,
  PACKAGE_ALERT_TYPE_WAREHOUSE_RETURN,
  PACKAGE_ALERT_TYPE_HUB_RETURN,
  PACKAGE_CODE_TEMP,
  PACKAGE_STATUS_ARCHIVED,
} from '../constants'
import {
  FETCH_LIST_PACKAGES,
  COUNT_LIST_PACKAGES,
  IMPORT_PACKAGE,
  EXPORT_PACKAGE,
  PROCESS_PACKAGE,
  CANCEL_PACKAGES,
} from '../store'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import TrackLink from '../components/TrackLink.vue'

export default {
  name: 'ListPackages',
  mixins: [mixinRoute, mixinTable, mixinDownload],
  components: {
    EmptySearchResult,
    PackageStatusTab,
    ModalExport,
    TrackLink,
  },
  props: {
    user_id: {
      type: Number,
      default: 0,
    },
    searchBy: {
      type: Object,
      default() {
        return {
          code: 'LionBay tracking',
          order_number: 'Mã đơn hàng',
          recipient: 'Người nhận',
          account: 'Tài khoản khách hàng',
          customer_full_name: 'Tên khách hàng',
          tracking: 'Last mile tracking',
        }
      },
    },
    listWarehouse: {
      type: Object,
      default() {
        return {
          hn: 'Hà nội',
          hcm: 'TP Hồ Chí Minh',
        }
      },
    },
  },
  data() {
    return {
      filter: {
        limit: 30,
        status: '',
        search: '',
        search_by: 'code',
        start_date: '',
        end_date: '',
        code: '',
        warehouse: null,
      },
      labelDate: `Tìm theo ngày`,
      isUploading: false,
      resultImport: {},
      keywordSearch: '',
      allowSearch: true,
      isFetching: false,
      isFetchingCount: false,
      isVisibleConfirmWayBill: false,
      visibleConfirmCancel: false,
      isVisibleExport: false,
      selected: [],
      PackageStatusDeactivate: PACKAGE_STATUS_DEACTIVATE,
      PackageStatusExpiredText: PACKAGE_STATUS_EXPIRED_TEXT,
    }
  },
  created() {
    this.keywordSearch = this.filter.search.trim()
    this.init()
  },

  computed: {
    ...mapState('package', {
      packages: (state) => state.packages,
      count: (state) => state.countPackages,
      count_status: (state) => state.count_status,
    }),
    ...mapState('shared', {
      wareHouses: (state) => state.wareHouses,
    }),
    hiddenClass() {
      return this.action.selected.length > 0 || this.isAllChecked
    },
    items() {
      return this.packages
    },
    showDetailPackage() {
      return !this.$isAccountant() && !this.$isSupport() && !this.$isSale()
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
        code: 'Tìm theo LionBay tracking',
        recipient: 'Tìm theo tên người nhận',
        account: 'Tìm theo email hoặc sđt của khách hàng',
        order_number: 'Tìm theo mã đơn hàng',
        customer: 'Tìm theo email hoặc sđt của khách hàng',
        customer_full_name: 'Tìm theo tên khách hàng',
        tracking: 'Tìm theo last mile tracking',
      }

      return maptext[this.filter.search_by] || maptext['id']
    },
  },
  methods: {
    ...mapActions('shared', [FETCH_WAREHOUSE]),
    ...mapActions('package', [
      FETCH_LIST_PACKAGES,
      IMPORT_PACKAGE,
      EXPORT_PACKAGE,
      PROCESS_PACKAGE,
      CANCEL_PACKAGES,
      COUNT_LIST_PACKAGES,
    ]),
    truncate,
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      if (this.user_id > 0) {
        this.filter.user_id = this.user_id
      }
      let req = { status: 1 }
      const [r1, r2] = await Promise.all([
        this[FETCH_LIST_PACKAGES](this.filter),
        this[FETCH_WAREHOUSE](req),
      ])
      this.isFetching = false
      if (!r1.success || !r2.success) {
        this.$toast.open({ message: r1.message || r2.message, type: 'error' })
        return
      }
      this.isFetchingCount = true
      const r3 = await this[COUNT_LIST_PACKAGES](this.filter)
      this.isFetchingCount = false
      if (!r3.success) {
        this.$toast.open({ message: r3.message, type: 'error' })
      }
    },
    showPackageCode(item) {
      if (item.status === PACKAGE_STATUS_ARCHIVED) {
        return false
      }
      return item.package_code
        ? item.package_code.status !== PACKAGE_CODE_TEMP
        : false
    },
    selectDate(v) {
      this.filter.start_date = date(v.startDate, 'yyyy-MM-dd')
      this.filter.end_date = date(v.endDate, 'yyyy-MM-dd')
    },
    clearSearchDate() {
      this.filter.end_date = ''
      this.filter.start_date = ''
      this.filter.page = 1
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
    convertPrice(item) {
      if (item.status_string == PACKAGE_STATUS_CREATED_TEXT) {
        return this.calculateFee(item.weight) + item.shipping_fee
      } else {
        return item.shipping_fee
      }
    },
    description(alert) {
      switch (alert) {
        case PACKAGE_ALERT_TYPE_OVER_PRE_TRANSIT:
          return 'Quá 7 ngày chờ lấy'
        case PACKAGE_ALERT_TYPE_WAREHOUSE_RETURN:
          return 'Bị kho trả lại'
        case PACKAGE_ALERT_TYPE_HUB_RETURN:
          return 'Hàng bị trả lại'
      }
    },
  },
  watch: {
    filter: {
      handler: function () {
        if (this.isFetching) {
          return
        }
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

td.code {
  max-width: 20vw !important;

  span.link-code,
  span.svg {
    position: relative;
    top: 3px;
  }
}

.fee .p-tooltip::after {
  white-space: pre !important;
}

.no-track-code,
.no-pkg-code {
  position: relative;
  left: 50px;
  display: inline-block;
}
</style>
