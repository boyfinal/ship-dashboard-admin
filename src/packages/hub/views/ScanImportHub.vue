<template>
  <div class="pages import__hub">
    <div class="page-content">
      <div class="mb-24">
        <div class="row">
          <div class="col-8">
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
                    placeholder="Nhập mã ups hoặc mã kiện"
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
              <div class="card-header">
                <div class="card-title">Danh sách</div>
              </div>
              <div class="card-body list-container">
                <div
                  v-if="containers.length > 0"
                  class="import__hub-containers"
                >
                  <div class="container-item">
                    <div
                      class="container-code"
                      v-for="(item, i) in containers"
                      :key="i"
                      >{{ item.code }}</div
                    >
                  </div>
                </div>
                <empty-search-result v-else></empty-search-result>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <p-pagination
                :total="1"
                :perPage.sync="filter.limit"
                :current.sync="filter.page"
                size="sm"
              ></p-pagination>
            </div>
          </div>
          <div class="col-4">
            <div class="card">
              <div class="card-header">
                <div class="card-title">Thông tin kiện hàng</div>
              </div>
              <div class="card-body">
                <div class="info-container">Mã kiện : {{ current_code }}</div>
                <div class="info-container"
                  >Nhãn kiện : {{ current_tracking_number }}</div
                >
                <div class="info-container">Dài : {{ current_length }}</div>
                <div class="info-container">Rộng : {{ current_width }}</div>
                <div class="info-container">Cao : {{ current_height }}</div>
                <div class="info-container"
                  >Cân nặng : {{ current_weight }}</div
                >
                <div class="info-container">Số đơn : {{ countPackage }}</div>
                <div class="info-container d-flex">
                  <span>Trạng thái:</span>
                  <span v-status:status="currentStatus"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PageLoading :is-loading="isFetchingContainer" />
  </div>
</template>
<script>
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinBarcode from '@core/mixins/barcode'
import { mapActions, mapState } from 'vuex'
import {
  GET_CONTAINER_IMPORT,
  FETCH_LIST_CONTAINER_IMPORTED,
  SCAN_CONTAINER_IMPORT,
} from '../store'
import PageLoading from '@components/shared/OverLoading'
import { MAP_NAME_STATUS_CONTAINER } from '../../container/contants'
import { cloneDeep } from '../../../core/utils'
import mixinRoute from '@core/mixins/route'

export default {
  name: 'ImportHub',
  components: { PageLoading, EmptySearchResult },
  mixins: [mixinBarcode, mixinRoute],
  computed: {
    ...mapState('hub', {
      current: (state) => state.container,
      countPackage: (state) => state.countPackages,
      count: (state) => state.count,
      containers: (state) => state.containers,
    }),
    disableBtnScan() {
      return !this.keyword || this.isFetchingContainer
    },
    disableBtnAccept() {
      return (
        this.isFetchingContainer ||
        !this.current_code ||
        !this.current_tracking_number ||
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
      },
      isFetchingContainer: false,
      current_code: '',
      current_width: '',
      current_length: '',
      current_weight: '',
      current_height: '',
      current_id: '',
      current_tracking_number: '',
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
      GET_CONTAINER_IMPORT,
      FETCH_LIST_CONTAINER_IMPORTED,
      SCAN_CONTAINER_IMPORT,
    ]),

    async searchHandle() {
      const keyword = this.keyword.trim()
      if (
        this.keyword == this.current_code ||
        this.keyword == this.current_tracking_number
      )
        return
      this.isCancel = false
      const params = {
        code: keyword,
      }
      this.isFetchingContainer = true
      const res = await this[GET_CONTAINER_IMPORT](params)
      if (!res.success) {
        this.isFetchingContainer = false
        this.$toast.open({
          type: 'error',
          message: res.message,
          duration: 3000,
        })
        return
      }
      this.isFetchingContainer = false
      this.current_code = this.current.code
      this.current_id = this.current.id
      this.current_height = this.current.height
      this.current_length = this.current.length
      this.current_width = this.current.width
      this.current_weight = this.current.weight
      this.current_tracking_number = this.current.tracking_number
    },
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      let payload = cloneDeep(this.filter)
      const result = await this[FETCH_LIST_CONTAINER_IMPORTED](payload)
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
      if (!this.current_code || this.isSubmitting || this.isCancel) return

      this.isSubmitting = true
      let params = {
        code: this.current_code,
      }
      const res = await this[SCAN_CONTAINER_IMPORT](params)

      if (!res.success) {
        this.$toast.error(res.message)
        this.isSubmitting = false
        return
      }
      this.isSubmitting = false
      this.isCancel = true
      this.$toast.success(`Kiện ${this.current_code} quét thành công`)
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
  },
}
</script>
