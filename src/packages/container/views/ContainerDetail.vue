<template>
  <div class="container-detail pages">
    <div class="page-content">
      <div class="page-header">
        <div class="page-header_back">
          <router-link :to="{ name: 'list-container' }" class="text">
            <img
              src="@/assets/img/chevron-left.svg"
              alt=""
              class="page-header_back_icon"
            />
            <span>Danh sách kiện hàng</span>
          </router-link>
        </div>

        <div class="page-header__subtitle">
          <div class="page-header__info">
            <div>
              <div>Kiện hàng:</div>
              <div class="package-code">{{ container_detail.id }} </div>
            </div>
            <div>
              <div>Mã kiện:</div>
              <div class="package-code">{{ container_detail.code }} </div>
            </div>
            <div>
              <div>Ngày tạo: </div>
              <div>{{
                container_detail.created_at | datetime('dd/MM/yyyy HH:mm:ss')
              }}</div>
            </div>
            <div>
              <div>Trạng thái kiện: </div>
              <div>{{
                container_detail.status
                  ? statusContainer[container_detail.status].text
                  : '-'
              }}</div>
            </div>
          </div>
        </div>

        <div class="page-header__subtitle row">
          <div class="page-header__input col-6">
            <p-input
              placeholder="Tìm theo mã vận đơn"
              prefixIcon="search"
              type="search"
              v-model="code"
              @keyup.enter="handleSearch"
            >
            </p-input>
            <p-button
              type="info"
              v-if="container_detail.status === CONTAINER_WAITING_CLOSE"
              :class="'btn-add-container ml-3'"
              @click="handleAppend"
            >
              <img src="@/assets/img/plus_blue.svg" />
              Thêm
            </p-button>
          </div>
          <div class="page-header__action col-6 text-right">
            <p-button
              id="startScanButton"
              type="info"
              :class="`mr-3`"
              v-if="
                !isStartScan &&
                  container_detail.status === CONTAINER_WAITING_CLOSE
              "
              @click="handleStartScan"
            >
              Bắt đầu quét
            </p-button>
            <p-button
              id="stopScanButton"
              v-if="
                isStartScan &&
                  container_detail.status === CONTAINER_WAITING_CLOSE
              "
              @click="handleStopScan"
              type="info"
              :class="`mr-3`"
              >Dừng quét</p-button
            >
            <p-button
              v-if="container_detail.status === CONTAINER_WAITING_CLOSE"
              type="info"
              @click="handlerClose"
              :class="`mr-3`"
            >
              Đóng kiện hàng
            </p-button>
            <p-button
              v-if="container_detail.status === CONTAINER_WAITING_CLOSE"
              type="danger"
              :class="`btn-cancel-shipment`"
              @click="handleCancelShipment"
            >
              Hủy kiện hàng
            </p-button>
          </div>
        </div>
      </div>
      <div class="page-content">
        <div class="card">
          <div class="card-body">
            <VclTable class="mt-20" v-if="isFetching"></VclTable>
            <template v-else-if="packages_in_container">
              <div class="table-responsive">
                <table class="table table-hover" id="tbl-packages">
                  <thead>
                    <tr>
                      <th>Mã vận đơn</th>
                      <th>Ngày tạo</th>
                      <th>Nhãn đơn hàng</th>
                      <th>Trọng lượng</th>
                      <th>Dài x Rộng x Cao</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in packages_in_container" :key="i">
                      <td>{{ item.code }}</td>
                      <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                      <td>
                        <a
                          class="text-no-underline"
                          v-if="item.tracking"
                          href="javascript:void(0)"
                          @click="downloadLabel(item.tracking.label_url)"
                          >{{ item.tracking.tracking_number }}</a
                        >
                      </td>
                      <td>{{ item.weight }}</td>
                      <td>
                        {{ getBoxInfo(item) }}
                      </td>
                      <td>
                        <p-button
                          v-if="
                            container_detail.status ===
                              CONTAINER_WAITING_CLOSE && filter.search === ''
                          "
                          type="danger"
                          :class="`btn-cancel-container`"
                          @click="handlerRemovePackage(item.id)"
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
                  :filter-limit="false"
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
  APPEND_PACKAGE_TO_CONTAINER,
  CANCEL_CONTAINER,
  CLOSE_CONTAINER,
  FETCH_CONTAINER_DETAIL,
  REMOVE_PACKAGE_FROM_CONTAINER,
  GET_LABEL,
} from '../store'

import { CONTAINER_STATUS_TAB, CONTAINER_WAITING_CLOSE } from '../contants'

import { cloneDeep } from '../../../core/utils'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import Browser from '@core/helpers/browser'

export default {
  name: 'ContainerDetail',
  mixins: [mixinRoute, mixinTable, mixinBarcode],
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
      CONTAINER_WAITING_CLOSE: CONTAINER_WAITING_CLOSE,
    }
  },
  computed: {
    ...mapState('container', {
      container_detail: (state) => state.container_detail,
      packages_in_container: (state) => state.packages_in_container,
      count: (state) => state.count_packages_in_container,
    }),
    items() {
      return this.packages_in_container
    },
    statusContainer() {
      return CONTAINER_STATUS_TAB
    },
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('container', [
      FETCH_CONTAINER_DETAIL,
      APPEND_PACKAGE_TO_CONTAINER,
      REMOVE_PACKAGE_FROM_CONTAINER,
      CLOSE_CONTAINER,
      CANCEL_CONTAINER,
      GET_LABEL,
    ]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      this.filter.search = this.code
      let payload = cloneDeep(this.filter)
      payload = { ...payload, ...{ id: parseInt(this.$route.params.id) } }
      const result = await this[FETCH_CONTAINER_DETAIL](payload)
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
    },
    getBoxInfo(packageDetail) {
      return `${packageDetail.length} x ${packageDetail.width}  x ${packageDetail.height}`
    },
    async handleAppend() {
      this.code = this.code.trim()
      if (this.code === '') {
        this.$toast.open({
          message: `Nhập mã vận đơn để thêm`,
          type: 'error',
        })
        return
      }
      const payload = {
        search: this.code,
        container_id: +this.$route.params.id,
      }
      const result = await this[APPEND_PACKAGE_TO_CONTAINER](payload)
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
      this.$toast.open({
        message: `Thêm đơn hàng thành công`,
        type: 'success',
      })
      this.code = ''
      await this.init()
    },
    async handlerRemovePackage(package_id) {
      const payload = {
        container_id: parseInt(this.$route.params.id),
        package_ids: [package_id],
      }
      const result = await this[REMOVE_PACKAGE_FROM_CONTAINER](payload)
      if (!result.success) {
        this.$toast.open({
          message: result.message,
          type: 'error',
        })
        return
      }
      this.$toast.open({
        message: `Hủy đơn hàng thành công`,
        type: 'success',
      })
      await this.init()
    },
    async handleCancelShipment() {
      const payload = {
        id: parseInt(this.$route.params.id),
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
      await this.init()
    },
    async handlerClose() {
      const payload = {
        id: parseInt(this.$route.params.id),
      }
      const result = await this[CLOSE_CONTAINER](payload)
      if (!result.success) {
        this.$toast.open({
          message: result.message,
          type: 'error',
        })
        return
      }
      this.$toast.open({
        message: `Đóng kiện hàng thành công`,
        type: 'success',
      })
      await this.init()
    },
    handleStartScan() {
      this.isStartScan = true
      document.getElementById('startScanButton').blur()
    },
    handleStopScan() {
      this.isStartScan = false
      document.getElementById('stopScanButton').blur()
    },
    async barcodeSubmit(keyword) {
      if (!this.isStartScan) {
        this.$toast.error('Bạn phải nhấn bắt đầu quét trước khi quét.')
        return
      }
      const payload = {
        tracking_number: keyword,
        container_id: +this.$route.params.id,
      }
      const result = await this[APPEND_PACKAGE_TO_CONTAINER](payload)
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
      this.$toast.open({
        message: `Thêm đơn hàng thành công`,
        type: 'success',
      })
      this.code = ''
      this.init()
    },

    async downloadLabel(labelUrl) {
      if (labelUrl === '') {
        this.$toast.open({
          type: 'error',
          message: 'Đơn không có tracking',
          duration: 3000,
        })
        return
      }

      let result = ''
      this.isFetching = true
      const payload = {
        url: labelUrl,
        type: 'labels',
      }
      result = await this.getLabel(payload)
      if (!result.success) {
        this.$toast.open({ type: 'error', message: `Download failed ! ` })
        return false
      }

      this.isFetching = false

      Browser.downloadBlob(result.blob, labelUrl.split('/').pop())
    },
    handleSearch(e) {
      this.filter.page = 1
      this.code = e.target.value.trim()
      this.$set(this.filter, 'search', this.code)
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
<style lang="scss">
.container-detail .btn-add-container {
  background-color: #dff6f7;
  color: #00b4c3;
  white-space: nowrap;
  border: none;
}
.container-detail .page-header_back {
  margin-bottom: 16px;
}
.container-detail .page-header_back a {
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.2px;
  color: #626363;
}
.container-detail .page-header_back a img {
  margin-top: -2px;
}
.container-detail .page-header_back a span {
  margin-left: 10px;
}
.container-detail .page-header {
  margin-bottom: 18px;
}
.container-detail .btn-add-container img {
  margin-top: -6px;
}
.container-detail .page-header__info {
  display: flex;
}
.page-header__input {
  display: flex;
}
.container-detail .page-header__input .input-group {
  width: calc(100% - 100px) !important;
}
.container-detail .btn-cancel-container {
  padding: 6px 16px;
  background-color: #fff1f0;
  border: none;
  color: red;
  border-radius: 4px;
}
.container-detail .btn-cancel-shipment {
  border: 1px solid #f5222d;
  color: red;
  background-color: #fff;
}

.page-header__subtitle {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.page-header__info {
  display: flex;
  //margin-left: 34px;
}

.page-header__info > {
  div {
    margin-right: 50px;
    div:last-child {
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>
