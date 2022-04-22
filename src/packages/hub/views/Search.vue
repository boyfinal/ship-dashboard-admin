<template>
  <div class="pages page-hub-search">
    <div class="page-content">
      <div class="d-flex jc-sb mb-12 search-input">
        <p-input
          placeholder="Nhập mã Ups, mã kiện, mã đơn,..."
          prefixIcon="search"
          type="search"
          clearable
          v-model="filter.search"
          @keyup.enter="searchHandle"
          @clear="clearSearch"
        >
        </p-input>
        <div class="d-flex date-search" v-if="!isTabPending">
          <p-datepicker
            :format="'dd/mm/yyyy'"
            class="p-input-group input-group"
            @update="selectDate"
            :label="labelDate"
            id="date-search"
            :ranges="true"
            :value="{
              startDate: filter.start_date,
              endDate: filter.end_date,
            }"
            @clear="clearSearchDate"
          ></p-datepicker>
        </div>
        <p-button
          id="export-btn"
          @click="searchHandle"
          class="btn btn-info ml-3 text-nowrap"
          >Quét</p-button
        >
      </div>
      <div class="card">
        <div class="">
          <StatusTab
            :status="tabStatus"
            v-model="filter.status"
            :has-all="false"
          />
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="items.length">
            <div class="table-responsive">
              <TabPending v-if="isTabPending" :items="items" />
              <TabReturn
                v-if="isTabReturn"
                :items="items"
                @select="showModalReturnHandle"
              />
              <TabReship v-if="isTabReship" :items="items" />
              <TabInHub v-if="isTabInHub" :items="items" />
              <TabExportHub v-if="isTabExportHub" :items="items" />
            </div>
            <div
              class="d-flex justify-content-between align-items-center mb-16"
              v-if="count > 0"
            >
              <p-pagination
                :total="count"
                :fixed-limit="false"
                :perPage.sync="filter.limit"
                :current.sync="filter.page"
                :filter-limit="true"
                size="sm"
              ></p-pagination>
            </div>
          </template>
          <empty-search-result v-else></empty-search-result>
        </div>
      </div>
    </div>

    <ModalReturn
      :visible.sync="isShowModalReturn"
      :submit="returnHandle"
      :current="current"
    />
  </div>
</template>
<script>
import {
  HUB_TAB,
  HUB_TAB_IDS,
  HUB_ITEM_FILTER_STATUS_EXPORT_TEXT,
  HUB_ITEM_FILTER_STATUS_RESHIP_TEXT,
  HUB_ITEM_FILTER_STATUS_RETURN_TEXT,
  HUB_ITEM_FILTER_STATUS_IN_TEXT,
  HUB_ITEM_FILTER_STATUS_PENDING_TEXT,
} from '../constants'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import {
  HUB_SEARCH_ITEMS,
  HUB_COUNT_SEARCH_ITEMS,
  HUB_RETURN,
  FETCH_PACKAGE_DETAIL,
} from '../store'
import { mapActions, mapState } from 'vuex'
import TabReturn from '../components/TabReturn'
import ModalReturn from '../components/ModalReturn'
import TabInHub from '../components/TabInHub'
import TabExportHub from '../components/TabExportHub'
import TabReship from '../components/TabReship'
import TabPending from '../components/TabPending'
import mixinBarcode from '@core/mixins/barcode'
import { date } from '@core/utils/datetime'

export default {
  name: 'HubSearch',
  components: {
    EmptySearchResult,
    TabReturn,
    ModalReturn,
    TabInHub,
    TabExportHub,
    TabReship,
    TabPending,
  },
  mixins: [mixinRoute, mixinTable, mixinBarcode],
  computed: {
    ...mapState('hub', {
      items: (state) => state.items,
      count: (state) => state.count,
    }),
    isTabInHub() {
      return this.checkStatus(HUB_ITEM_FILTER_STATUS_IN_TEXT)
    },
    isTabExportHub() {
      return this.checkStatus(HUB_ITEM_FILTER_STATUS_EXPORT_TEXT)
    },
    isTabReturn() {
      return this.checkStatus(HUB_ITEM_FILTER_STATUS_RETURN_TEXT)
    },
    isTabReship() {
      return this.checkStatus(HUB_ITEM_FILTER_STATUS_RESHIP_TEXT)
    },
    isTabPending() {
      return this.checkStatus(HUB_ITEM_FILTER_STATUS_PENDING_TEXT)
    },
    labelDate() {
      if (this.isTabExportHub) {
        return `Tìm theo ngày xuất hub`
      }

      return `Tìm theo ngày nhập hub`
    },
  },
  data() {
    return {
      filter: {
        search: '',
        status: HUB_ITEM_FILTER_STATUS_IN_TEXT,
        limit: 20,
        start_date: '',
        end_date: '',
        page: 1,
      },
      tabStatus: HUB_TAB,
      isFetching: false,
      isShowModalReturn: false,
      current: {},
    }
  },
  mounted() {
    this.filter = this.getRouteQuery()
    this.searchHandle()
  },
  methods: {
    ...mapActions('hub', {
      searchSubmit: HUB_SEARCH_ITEMS,
      countSearchSubmit: HUB_COUNT_SEARCH_ITEMS,
      returnSubmit: HUB_RETURN,
      fetchPackageDetail: FETCH_PACKAGE_DETAIL,
    }),
    selectDate(v) {
      this.filter.start_date = date(v.startDate, 'yyyy-MM-dd')
      this.filter.end_date = date(v.endDate, 'yyyy-MM-dd')
    },
    clearSearchDate() {
      this.filter.end_date = ''
      this.filter.start_date = ''
      this.filter.page = 1
    },
    barcodeSubmit(keyword) {
      keyword = keyword.trim()

      if (keyword != '' && this.filter.search != keyword) {
        this.filter.search = keyword.trim()
        this.searchHandle()
      }
    },
    async searchHandle() {
      this.handleUpdateRouteQuery()

      const filters = Object.assign({}, this.filter)
      filters.status = HUB_TAB_IDS[this.filter.status]

      this.isFetching = true

      const res = await Promise.all([
        this.searchSubmit(filters),
        this.countSearchSubmit(filters),
      ])

      this.isFetching = false

      for (const v of res) {
        if (v.error) {
          this.$toast.error(v.message)
        }
      }
    },

    checkStatus(status) {
      return status == this.filter.status
    },

    async showModalReturnHandle(item) {
      const res = await this.fetchPackageDetail(item.id)
      if (res.error) {
        this.$toast.error(res.message)
        return false
      }

      if (item.id != res.package.id) return

      this.current = {
        id: item.id,
        code: item.code,
        package_return: res.package.package_return,
      }

      this.isShowModalReturn = true
    },
    async returnHandle(payload) {
      const res = await this.returnSubmit(payload)
      if (res.error) {
        this.$toast.error(res.message)
        return false
      }

      this.isShowModalReturn = false
      this.current = {}
      this.$toast.success('Thêm lý do trả hàng thành công')

      await this.searchHandle()

      return true
    },
  },

  watch: {
    'filter.page': function () {
      this.searchHandle()
    },
    'filter.limit': function () {
      this.filter.page = 1
      this.searchHandle()
    },
    'filter.status': function () {
      this.filter.page = 1
      this.searchHandle()
    },
    'filter.start_date': function () {
      this.filter.page = 1
      this.searchHandle()
    },
    'filter.end_date': function () {
      this.filter.page = 1
      this.searchHandle()
    },
  },
}
</script>
<style>
.page-hub-search .table a {
  color: #015858;
}
</style>
