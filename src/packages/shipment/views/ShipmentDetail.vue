<template>
  <div class="shipment-detail pages">
    <div class="page-content">
      <div class="page-header">
        <div class="page-header_back">
          <router-link :to="{ name: 'list-shipment' }" class="text">
            <img
              src="@/assets/img/chevron-left.svg"
              alt=""
              class="page-header_back_icon"
            />
            <span>Lô hàng</span>
          </router-link>
        </div>

        <div class="page-header__subtitle">
          <div class="page-header__info">
            <div class="info">
              <div>Mã lô:</div>
              <div class="package-code">{{ shipment.id }} </div>
            </div>
            <div class="info">
              <div>Ngày tạo: </div>
              <div>{{
                shipment.created_at | datetime('dd/MM/yyyy HH:mm:ss')
              }}</div>
            </div>
            <div
              class="info"
              v-if="shipment.manifest && shipment.manifest.manifest_number"
            >
              <div>Manifest: </div>
              <div>
                <a
                  class="text-no-underline"
                  href="javascript:void(0)"
                  @click="downloadLabel(shipment.manifest.manifest_url)"
                  >{{ shipment.manifest.manifest_number }}</a
                >
              </div>
            </div>
            <div class="info">
              <div>Trạng thái lô: </div>
              <div>{{
                shipment.status ? shipmentStatus[shipment.status].text : '-'
              }}</div>
            </div>
          </div>
        </div>

        <div class="page-header__subtitle row">
          <div class="page-header__info col-6">
            <p-input
              placeholder="Tìm theo mã kiện hàng"
              prefixIcon="search"
              type="search"
              v-model="code"
              @keyup.enter="handleSearch"
            >
            </p-input>
            <p-button
              type="info"
              :class="'btn-add-container ml-3'"
              @click="handleAppendShipment"
              v-if="!isClosedShipment && !isCanceledShipment"
            >
              <img src="@/assets/img/plus_blue.svg" />
              Thêm
            </p-button>
          </div>
          <div
            class="page-header__action col-6 text-right"
            v-if="!isClosedShipment && !isCanceledShipment"
          >
            <p-button
              type="info"
              class="mr-3"
              v-if="!isStartScan"
              @click="handleStartScan"
            >
              Bắt đầu quét
            </p-button>
            <p-button type="info" class="mr-3" v-else @click="handleStopScan"
              >Dừng quét</p-button
            >
            <p-button
              type="info"
              @click="handleCloseShipment"
              :loading="loading"
              :class="`mr-3`"
            >
              Đóng lô hàng
            </p-button>
            <p-button
              type="danger"
              :class="`btn-cancel-shipment`"
              @click="handleCancelShipment"
            >
              Hủy lô hàng
            </p-button>
          </div>
          <div
            class="page-header__action col-6 text-right"
            v-if="isClosedShipment"
          >
            <p-button type="info" @click="handleExport()" :class="`mr-3`">
              Xuất excel
            </p-button>
          </div>
        </div>
      </div>
      <div class="page-content">
        <div class="card">
          <div class="card-body">
            <VclTable class="mt-20" v-if="isFetching"></VclTable>
            <template v-else-if="containers.length">
              <div class="table-responsive">
                <table class="table table-hover" id="tbl-packages">
                  <thead>
                    <tr>
                      <th>Mã kiện hàng</th>
                      <th>Ngày tạo</th>
                      <th>Nhãn kiện hàng</th>
                      <th>Số lượng</th>
                      <th>Trọng lượng</th>
                      <th>Dài x Rộng x Cao</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in containers" :key="i">
                      <td>
                        <router-link
                          :to="{
                            name: 'container-detail',
                            params: {
                              id: item.id,
                            },
                          }"
                        >
                          {{ item.code }}
                        </router-link>
                      </td>
                      <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                      <td>
                        <a
                          target="_blank"
                          class="text-no-underline"
                          v-if="item.tracking_number"
                          :href="
                            `https://www.ups.com/track?loc=vi_VN&tracknum=${item.tracking_number}&requester=WT/`
                          "
                          @click="downloadLabel(item.label_url)"
                          >{{ item.tracking_number }}</a
                        >
                      </td>
                      <td>{{
                        item.container_items ? item.container_items.length : '0'
                      }}</td>
                      <td>{{ item.weight }}</td>
                      <td>
                        {{ getBoxInfo(item) }}
                      </td>
                      <td>
                        <p-button
                          v-if="!isClosedShipment"
                          type="danger"
                          :class="`btn-cancel-container`"
                          @click="handleCancelContainer(item.id)"
                        >
                          Hủy
                        </p-button>
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
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import mixinBarcode from '@core/mixins/barcode'
import {
  APPEND_SHIPMENT,
  CANCEL_CONTAINER,
  CANCEL_SHIPMENT,
  CLOSE_SHIPMENT,
  FETCH_SHIPMENT_DETAIL,
  EXPORT_SHIPMENT,
} from '../store'
import { GET_LABEL } from '../../container/store'
import { cloneDeep } from '../../../core/utils'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinDownload from '@/packages/shared/mixins/download'
import {
  ShipmentClosed,
  ShipmentCanceled,
  SHIPMENT_STATUS_TAB,
} from '../constants'
import Browser from '@core/helpers/browser'
export default {
  name: 'ShipmentDetail',
  mixins: [mixinRoute, mixinTable, mixinBarcode, mixinDownload],
  components: {
    EmptySearchResult,
  },
  data() {
    return {
      isFetching: false,
      filter: {
        limit: 30,
        page: 1,
        search: '',
      },
      code: '',
      isStartScan: false,
      loading: false,
      ShipmentClosed: ShipmentClosed,
    }
  },
  computed: {
    ...mapState('shipment', {
      shipment: (state) => state.shipment,
      containers: (state) => state.containers,
      count: (state) => state.container_count,
      isCanceledShipment() {
        return this.shipment.status === ShipmentCanceled
      },
      isClosedShipment() {
        return this.shipment.status === ShipmentClosed
      },
      shipmentStatus() {
        return SHIPMENT_STATUS_TAB
      },
    }),
    items() {
      return this.containers
    },
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('shipment', [
      FETCH_SHIPMENT_DETAIL,
      APPEND_SHIPMENT,
      CANCEL_CONTAINER,
      CANCEL_SHIPMENT,
      CLOSE_SHIPMENT,
      EXPORT_SHIPMENT,
    ]),
    ...mapActions('container', [GET_LABEL]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      let payload = cloneDeep(this.filter)
      payload = { ...payload, ...{ id: parseInt(this.$route.params.id) } }
      const result = await this[FETCH_SHIPMENT_DETAIL](payload)
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
    },
    getBoxInfo(container) {
      return `${container.length} x ${container.width}  x ${container.height}`
    },
    async downloadLabel(labelUrl) {
      if (labelUrl == '') {
        this.$toast.open({
          type: 'error',
          message: "This tracking doesn't have label",
          duration: 3000,
        })
        return
      }
      let result = ''

      const payload = {
        url: labelUrl,
        type: 'labels',
      }
      result = await this[GET_LABEL](payload)

      if (!result.success) {
        this.$toast.open({ type: 'error', message: `Download failed ! ` })
        return false
      }

      Browser.downloadBlob(result.blob, labelUrl.split('/').pop())
    },
    handleSearch(e) {
      this.filter.page = 1
      this.code = e.target.value.trim()
      this.$set(this.filter, 'search', this.code)
    },
    async handleAppendShipment() {
      this.code = this.code.trim()
      if (this.code == '') {
        this.$toast.open({
          message: `Nhập mã kiện hàng để thêm`,
          type: 'error',
        })
        return
      }
      const payload = {
        search: this.code,
        shipment_id: parseInt(this.$route.params.id),
      }
      const result = await this[APPEND_SHIPMENT](payload)
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
      this.$toast.open({
        message: `Thêm kiện hàng mã ${result.container.code} thành công`,
        type: 'success',
      })
      this.init()
    },
    async handleCancelContainer(container_id) {
      const payload = {
        container_id: container_id,
        shipment_id: parseInt(this.$route.params.id),
      }
      const result = await this[CANCEL_CONTAINER](payload)
      if (!result.success) {
        this.$toast.open({
          message: result.message,
          type: 'error',
        })
        return
      }
      this.$toast.open({
        message: `Hủy kiện hàng thành công`,
        type: 'success',
      })
      this.init()
    },
    async handleCancelShipment() {
      const payload = {
        id: parseInt(this.$route.params.id),
      }
      const result = await this[CANCEL_SHIPMENT](payload)
      if (!result.success) {
        this.$toast.open({
          message: result.message,
          type: 'error',
        })
        return
      }
      this.$toast.open({
        message: `Hủy lô hàng thành công`,
        type: 'success',
      })
      this.init()
    },
    async handleCloseShipment() {
      this.loading = true
      const payload = {
        id: parseInt(this.$route.params.id),
      }
      const result = await this[CLOSE_SHIPMENT](payload)
      this.loading = false
      if (!result.success) {
        this.$toast.open({
          message: result.message,
          type: 'error',
        })
        return
      }
      this.$toast.open({
        message: `Đóng lô hàng thành công`,
        type: 'success',
      })
      this.init()
    },
    handleStartScan() {
      this.isStartScan = true
    },
    handleStopScan() {
      this.isStartScan = false
    },
    async barcodeSubmit(keyword) {
      if (!this.isStartScan) {
        this.$toast.error('Bạn phải nhấn bắt đầu quét trước khi quét.')
        return
      }
      const payload = {
        barcode: keyword.toUpperCase(),
        shipment_id: parseInt(this.$route.params.id),
      }
      const result = await this[APPEND_SHIPMENT](payload)
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
      this.$toast.open({
        message: `Thêm kiện hàng thành công`,
        type: 'success',
      })
      this.init()
    },
    async handleExport() {
      let item_id = this.$route.params.id
      const result = await this[EXPORT_SHIPMENT]({
        id: +item_id,
      })
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        return
      }
      this.downloadFile(
        result.url,
        'packages',
        result.url.split('/'),
        'danh_sach_don_hang_'
      )
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
<style>
.shipment-detail .btn-add-container {
  background-color: #dff6f7;
  color: #00b4c3;
  white-space: nowrap;
  border: none;
}
.shipment-detail .page-header_back {
  margin-bottom: 16px;
}
.shipment-detail .page-header_back a {
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.2px;
  color: #626363;
}
.shipment-detail .page-header_back a img {
  margin-top: -2px;
}
.shipment-detail .page-header_back a span {
  margin-left: 10px;
}
.shipment-detail .page-header {
  margin-bottom: 18px;
}
.shipment-detail .btn-add-container img {
  margin-top: -6px;
}
.shipment-detail .page-header__info {
  display: flex;
}
.shipment-detail .page-header__info .input-group {
  width: calc(100% - 100px);
}
.shipment-detail .btn-cancel-container {
  padding: 6px 16px;
  background-color: #fff1f0;
  border: none;
  color: red;
  border-radius: 4px;
}
.shipment-detail .btn-cancel-shipment {
  border: 1px solid #f5222d;
  color: red;
  background-color: #fff;
}
.page-header__info > .info {
  margin-right: 50px;
}
.page-header__info > div div:last-child {
  font-size: 16px;
  font-weight: 600;
}
.page-header__subtitle {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}
</style>
