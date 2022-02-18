<template>
  <div class="pages export__hub">
    <div class="page-content">
      <div class="mb-24">
        <div class="row">
          <div class="col-9">
            <div class="card mb-16">
              <div class="card-body">
                <div class="d-flex">
                  <p-input
                    prefixIcon="search"
                    clearable
                    type="search"
                    :disabled="disableInput"
                    v-model="keyword"
                    @keydown.enter.prevent="searchHandle"
                    placeholder="Nhập mã kiện, mã đơn"
                  ></p-input>
                  <button
                    @click.prevent="searchHandle"
                    :disabled="disableBtnScan"
                    class="btn btn-scan-info ml-3 text-nowrap"
                    >Quét</button
                  >
                  <button
                    :disabled="disableBtnAccept"
                    @click.prevent="acceptSubmit"
                    class="btn btn-scan-info ml-3 text-nowrap"
                    >Xác nhận</button
                  >
                </div>
              </div>
            </div>

            <div class="card mb-16">
              <div class="card-body">
                <export-hub-tab :type="typeTab" v-model="filter.type" />
                <div class="card-header">
                  <div class="card-title">MÃ KIỆN/ĐƠN</div>
                </div>
                <div class="card-body list-container">
                  <div v-if="codes.length > 0" class="export__hub-containers">
                    <div class="container-item">
                      <div
                        class="container-code"
                        v-for="(item, i) in codes"
                        :key="i"
                      >
                        {{ item }}
                        <p-button
                          class="mr-2 btn-submit"
                          type="info"
                          @click.prevent="acceptSubmit(item)"
                        >
                          Xuất
                        </p-button>
                      </div>
                    </div>
                  </div>
                  <empty-search-result v-else></empty-search-result>
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <p-pagination
                :total="count"
                :perPage.sync="filter.limit"
                :current.sync="filter.page"
                size="sm"
              ></p-pagination>
            </div>
          </div>

          <div class="col-3">
            <div v-if="filter.type == 'container'" class="card">
              <div class="card-header">
                <div class="card-title">Thông tin kiện hàng</div>
              </div>
              <div class="card-body">
                <div class="info-container"
                  >Mã kiện : {{ current_container.code }}</div
                >
                <div class="info-container"
                  >Nhãn kiện : {{ current_container.tracking_number }}</div
                >
                <div class="info-container"
                  >Dài : {{ current_container.length }}</div
                >
                <div class="info-container"
                  >Rộng : {{ current_container.width }}</div
                >
                <div class="info-container"
                  >Cao : {{ current_container.height }}</div
                >
                <div class="info-container"
                  >Cân nặng : {{ current_container.weight }}</div
                >
                <div class="info-container">Số đơn : {{ countPackage }}</div>
                <div class="info-container d-flex">
                  <span>Trạng thái:</span>
                  <span
                    v-status:status="current_container.currentStatus"
                  ></span>
                </div>
              </div>
            </div>

            <div v-if="filter.type == 'package'" class="card">
              <div class="card-header">
                <div class="card-title">Thông tin đơn hàng</div>
              </div>
              <div class="card-body">
                <div class="info-container"
                  >Mã đơn : {{ current_package.code }}</div
                >
                <div class="info-container"
                  >Order number : {{ current_package.order_number }}</div
                >
                <div class="info-container"
                  >Mã tracking : {{ current_package.tracking_number }}</div
                >
                <div class="info-container"
                  >Dài : {{ current_package.length }}</div
                >
                <div class="info-container"
                  >Rộng : {{ current_package.width }}</div
                >
                <div class="info-container"
                  >Cao : {{ current_package.height }}</div
                >
                <div class="info-container"
                  >Cân nặng : {{ current_package.weight }}</div
                >
                <div class="info-container d-flex">
                  <span>Trạng thái:</span>
                  <span v-status:status="current_package.currentStatus"></span>
                </div>
              </div>
            </div>

            <div class="card list-export">
              <div class="card-header">
                <div class="card-title">Danh sách xuất</div>
              </div>
              <div class="card-body">
                <div class="empty">
                  <p-svg name="empty"></p-svg>
                  <p>Chưa có đơn hàng được quét!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PageLoading :is-loading="isFetchingImportHub" />
  </div>
</template>
<script>
import ExportHubTab from '../components/ExportHubTab.vue'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinBarcode from '@core/mixins/barcode'
import { mapActions, mapState } from 'vuex'
import {
  GET_IMPORT_HUB_DETAIL,
  FETCH_LIST_IMPORTED,
  SCAN_EXPORT_HUB,
} from '../store'
import PageLoading from '@components/shared/OverLoading'
import { MAP_NAME_STATUS_CONTAINER } from '../../container/contants'
import { EXPORT_HUB_TAB } from '../constants'
import { cloneDeep } from '../../../core/utils'
import mixinRoute from '@core/mixins/route'

export default {
  name: 'ExportHub',
  components: { PageLoading, EmptySearchResult, ExportHubTab },
  mixins: [mixinBarcode, mixinRoute],
  computed: {
    ...mapState('hub', {
      current: (state) => state.importHubDetail,
      countPackage: (state) => state.countPackages,
      count: (state) => state.coutListImported,
      codes: (state) => state.listImported,
    }),
    typeTab() {
      return EXPORT_HUB_TAB
    },
    disableBtnScan() {
      return !this.keyword || this.isFetchingImportHub
    },
    disableBtnAccept() {
      return (
        this.isFetchingImportHub ||
        !this.code ||
        !this.tracking_number ||
        this.isCancel
      )
    },
    currentStatus() {
      const allstatus = MAP_NAME_STATUS_CONTAINER
      return (allstatus[this.current.status] || {}).value
    },
  },
  data() {
    return {
      disableInput: false,
      keyword: '',
      filter: {
        limit: 10,
        page: 1,
        type: 'container',
      },
      isFetchingImportHub: false,
      current_container: {
        code: '',
        width: '',
        length: '',
        weight: '',
        height: '',
        id: '',
        tracking_number: '',
      },
      current_package: {
        code: '',
        width: '',
        length: '',
        weight: '',
        height: '',
        id: '',
        order_number: '',
        tracking_number: '',
      },
      isSubmitting: false,
      isCancel: false,
    }
  },
  created() {
    this.filter = this.getRouteQuery()
    this.init()
  },
  methods: {
    ...mapActions('hub', [
      GET_IMPORT_HUB_DETAIL,
      FETCH_LIST_IMPORTED,
      SCAN_EXPORT_HUB,
    ]),

    async searchHandle() {
      this.filter.page = 1
      if (this.filter.type == 'package') {
        this.current_container = {}
      } else if (this.filter.type == 'container') {
        this.current_package = {}
      } else {
        this.current_container = {}
        this.current_package = {}
      }
      const keyword = this.keyword.trim()
      if (
        this.keyword == this.current_container.code ||
        this.keyword == this.current_package.code ||
        this.keyword == this.tracking_number
      )
        return
      this.isCancel = false

      this.handleUpdateRouteQuery()

      let params = {
        type: this.filter.type,
        code: keyword,
      }
      const result = await this[FETCH_LIST_IMPORTED](params)
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }

      params = {
        type: this.filter.type,
        code: keyword,
      }

      this.isFetchingImportHub = true
      const res = await this[GET_IMPORT_HUB_DETAIL](params)
      if (!res.success) {
        this.isFetchingImportHub = false
        this.$toast.open({
          type: 'error',
          message: res.message,
          duration: 3000,
        })
        return
      }

      this.isFetchingImportHub = false
      if (this.filter.type == 'container') {
        this.current_container.code = this.current.code
        this.current_container.id = this.current.id
        this.current_container.height = this.current.height
        this.current_container.length = this.current.length
        this.current_container.width = this.current.width
        this.current_container.weight = this.current.weight
        this.current_container.tracking_number = this.current.tracking_number
      } else if (this.filter.type == 'package') {
        console.log(this.current)
        this.current_package.code = this.current.package_code.code
        this.current_package.id = this.current.id
        this.current_package.height = this.current.height
        this.current_package.length = this.current.length
        this.current_package.width = this.current.width
        this.current_package.weight = this.current.weight
        this.current_package.order_number = this.current.order_number
        this.current_package.tracking_number = this.current.tracking_number
      }
    },

    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      let payload = cloneDeep(this.filter)
      const result = await this[FETCH_LIST_IMPORTED](payload)
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
    },

    barcodeSubmit(keyword) {
      this.disableInput = true
      this.keyword = keyword
      this.searchHandle()
      this.disableInput = false
    },

    async acceptSubmit() {
      if (
        (!this.current_package && !this.current_container) ||
        this.isSubmitting ||
        this.isCancel
      )
        return

      this.isSubmitting = true
      let payload = {
        code: this.current_package.code
          ? this.current_package.code
          : this.current_container.code,
        type: this.filter.type,
      }
      const res = await this[SCAN_EXPORT_HUB](payload)

      if (!res.success) {
        this.$toast.error(res.message)
        this.isSubmitting = false
        return
      }
      this.isSubmitting = false
      this.isCancel = true
      this.$toast.success(`Kiện ${this.code} quét thành công`)
      this.init()
    },
  },
  watch: {
    filter: {
      handler: function() {
        this.init()
      },
      deep: true,
    },
    keyword: {
      handler: function() {
        if (this.keyword == '') {
          this.filter.code = ''
          this.init()
        }
      },
      deep: true,
    },
  },
}
</script>
