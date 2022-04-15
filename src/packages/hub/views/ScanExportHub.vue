<template>
  <div class="pages export__hub">
    <div class="page-content">
      <div class="mb-24">
        <div class="row">
          <div class="col-4">
            <div class="card mb-16">
              <div class="card-body">
                <div class="">
                  <div class="d-flex">
                    <p-input
                      prefixIcon="search"
                      clearable
                      class="mb-8"
                      type="search"
                      :disabled="disableInput"
                      v-model="keyword"
                      @clear="clearInput"
                      placeholder="Nhập mã kiện/ups, mã đơn/usps"
                    ></p-input>
                  </div>
                  <button
                    @click.prevent="searchHandle"
                    :disabled="disableBtnScan"
                    class="btn btn-scan-info text-nowrap"
                    >Quét</button
                  >
                </div>
              </div>
            </div>

            <!--            <div class="card mb-16">-->
            <!--              <div class="card-body">-->
            <!--                <export-hub-tab :type="typeTab" v-model="filter.type" />-->
            <!--                <div class="card-header">-->
            <!--                  <div class="card-title">MÃ KIỆN/ĐƠN</div>-->
            <!--                </div>-->
            <!--                <div class="card-body list-container">-->
            <!--                  <div v-if="codes.length > 0" class="export__hub-containers">-->
            <!--                    <div class="container-item">-->
            <!--                      <div-->
            <!--                        class="container-code"-->
            <!--                        v-for="(item, i) in codes"-->
            <!--                        :key="i"-->
            <!--                      >-->
            <!--                        {{ item }}-->
            <!--                        <p-button-->
            <!--                          class="mr-2 btn-submit"-->
            <!--                          type="info"-->
            <!--                          @click.prevent="handelModalConfirm(item)"-->
            <!--                        >-->
            <!--                          Xuất-->
            <!--                        </p-button>-->
            <!--                      </div>-->
            <!--                    </div>-->
            <!--                  </div>-->
            <!--                  <empty-search-result v-else></empty-search-result>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </div>-->
            <!--            <div class="d-flex justify-content-between align-items-center">-->
            <!--              <p-pagination-->
            <!--                :total="count"-->
            <!--                :perPage.sync="filter.limit"-->
            <!--                :current.sync="filter.page"-->
            <!--                size="sm"-->
            <!--              ></p-pagination>-->
            <!--            </div>-->
          </div>

          <div class="col-8">
            <div
              v-if="filter.type == 'container' && current_container.code"
              class="card"
            >
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
                <div class="info-container"
                  >Số đơn : {{ current_container.count }}</div
                >
                <div class="info-container d-flex">
                  <span>Trạng thái:</span>
                  <span v-status="currentStatus" type="container"></span>
                </div>
                <hr class="hr mb-24 mt-24" />
                <p-button
                  class="mr-2 btn-submit"
                  type="info"
                  @click.prevent="handelModalConfirm(current_container.code)"
                >
                  Xuất
                </p-button>
              </div>
            </div>

            <div
              v-else-if="filter.type == 'package' && current_package.code"
              class="card"
            >
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
                  <span v-status="currentStatus"></span>
                </div>
                <hr class="hr mb-24 mt-24" />
                <p-button
                  class="mr-2 btn-submit"
                  type="info"
                  @click.prevent="handelModalConfirm(current_package.code)"
                >
                  Xuất
                </p-button>
              </div>
            </div>
            <div v-else class="card">
              <div class="card-header">
                <div class="card-title">{{ convertHeader }}</div>
              </div>
              <EmptySearchResult
                :type="filter.type === 'container' ? 'kiện' : 'đơn'"
              ></EmptySearchResult>
            </div>

            <!--            <div class="card list-export" v-if="filter.type == 'container'">-->
            <!--              <div class="card-header">-->
            <!--                <div class="card-title">Danh sách xuất kiện hàng</div>-->
            <!--              </div>-->
            <!--              <div class="card-body">-->
            <!--                <div class="empty" v-if="listExportedContainer.length == 0">-->
            <!--                  <p-svg name="empty"></p-svg>-->
            <!--                  <p>Chưa có đơn hàng được quét!</p>-->
            <!--                </div>-->
            <!--                <div class="list-exported" v-else>-->
            <!--                  <div-->
            <!--                    class="item-exported"-->
            <!--                    v-for="(item, i) in listExportedContainer"-->
            <!--                    :key="i"-->
            <!--                  >-->
            <!--                    {{ item }}-->
            <!--                  </div>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </div>-->

            <!--            <div class="card list-export" v-if="filter.type == 'package'">-->
            <!--              <div class="card-header">-->
            <!--                <div class="card-title">Danh sách xuất đơn hàng</div>-->
            <!--              </div>-->
            <!--              <div class="card-body">-->
            <!--                <div class="empty" v-if="listExportedPackage.length == 0">-->
            <!--                  <p-svg name="empty"></p-svg>-->
            <!--                  <p>Chưa có đơn hàng được quét!</p>-->
            <!--                </div>-->
            <!--                <div class="list-exported" v-else>-->
            <!--                  <div-->
            <!--                    class="item-exported"-->
            <!--                    v-for="(item, i) in listExportedPackage"-->
            <!--                    :key="i"-->
            <!--                  >-->
            <!--                    {{ item }}-->
            <!--                  </div>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </div>
      </div>
    </div>
    <PageLoading :is-loading="isFetchingImportHub" />
    <modal-confirm
      :visible.sync="visibleConfirm"
      :actionConfirm="`Có`"
      :cancel="`Không`"
      :description="`Bạn có chắc chắn muốn xuất đơn/kiện này ?`"
      :title="`Xác nhận xuất`"
      @action="acceptSubmit"
    ></modal-confirm>
  </div>
</template>
<script>
// import ExportHubTab from '../components/ExportHubTab.vue'
// import EmptySearchResult from '@components/shared/EmptySearchResult'
import EmptySearchResult from '../components/Empty'
import mixinBarcode from '@core/mixins/barcode'
import { mapActions, mapState } from 'vuex'
import {
  GET_IMPORT_HUB_DETAIL,
  FETCH_LIST_IMPORTED,
  SCAN_EXPORT_HUB,
} from '../store'
import PageLoading from '@components/shared/OverLoading'
import { EXPORT_HUB_TAB } from '../constants'

import mixinRoute from '@core/mixins/route'
import ModalConfirm from '@components/shared/modal/ModalConfirm'

export default {
  name: 'ExportHub',
  components: { PageLoading, ModalConfirm, EmptySearchResult },
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
      return !this.keyword || this.isFetchingImportHub || this.isScan
    },

    currentStatus() {
      if (this.filter.type == 'container') {
        return this.current_container.status
      }

      return this.current_package.status
    },
    convertHeader() {
      return `Thông tin ${
        this.filter.type == 'container' ? 'kiện' : 'đơn'
      } hàng`
    },
    searchPlaceholder() {
      const maptext = {
        container: 'Nhập mã kiện/ups',
        package: 'Nhập mã đơn/ups',
      }

      return maptext[this.filter.type] || maptext['container']
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
      currentCode: '',
      current_container: {
        code: '',
        width: '',
        length: '',
        weight: '',
        height: '',
        id: '',
        tracking_number: '',
        status: '',
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
        status: '',
      },
      visibleConfirm: false,
      isSubmitting: false,
      listExportedContainer: [],
      listExportedPackage: [],
      isScan: false,
      searchBy: {
        container: 'Kiện hàng',
        package: 'Đơn hàng',
      },
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
      const keyword = this.keyword.trim()
      if (!keyword) {
        this.$toast.open({
          message: 'Mã nhập vào không để trống',
          type: 'error',
        })
        return
      }

      if (/\W|_/g.test(keyword)) {
        this.$toast.open({
          message: 'Mã nhập vào không đúng định dạng',
          type: 'error',
        })
        return
      }

      if (
        this.keyword == this.current_container.code ||
        this.keyword == this.current_package.code ||
        this.keyword == this.tracking_number
      )
        return

      this.handleUpdateRouteQuery()

      let params = {
        type: this.filter.type,
        code: keyword,
      }
      const result = await this[FETCH_LIST_IMPORTED](params)

      this.isScan = true
      this.isFetchingImportHub = true
      const res = await this[GET_IMPORT_HUB_DETAIL](params)
      if (!res.success || !result.success) {
        this.isFetchingImportHub = false
        this.isScan = false
        this.$toast.error(res.message, { duration: 3000 })
        return
      }

      console.log(this.filter.type)
      this.isFetchingImportHub = false
      this.isScan = false
      this.filter.type = res.type
      if (this.filter.type == 'container') {
        this.current_container.code = this.current.code
        this.current_container.id = this.current.id
        this.current_container.height = this.current.height
        this.current_container.length = this.current.length
        this.current_container.width = this.current.width
        this.current_container.weight = this.current.weight
        this.current_container.tracking_number = this.current.tracking_number
        this.current_container.status = this.current.status
        this.current_container.count = this.countPackage
      } else if (this.filter.type == 'package') {
        this.current_package.code = this.current.package_code.code
        this.current_package.id = this.current.id
        this.current_package.height = this.current.height
        this.current_package.length = this.current.length
        this.current_package.width = this.current.width
        this.current_package.weight = this.current.weight
        this.current_package.order_number = this.current.order_number
        this.current_package.tracking_number =
          this.current.tracking.tracking_number
        this.current_package.status = this.current.status
      }
    },

    async init() {
      this.isFetching = true
      // this.clearData()
      this.handleUpdateRouteQuery()
      // let payload = cloneDeep(this.filter)
      // const result = await this[FETCH_LIST_IMPORTED](payload)
      // this.isFetching = false
      // if (!result.success) {
      //   this.$toast.error(result.message)
      // }
    },

    clearData() {
      this.current_container.code = ''
      this.current_container.id = ''
      this.current_container.height = ''
      this.current_container.length = ''
      this.current_container.width = ''
      this.current_container.weight = ''
      this.current_container.tracking_number = ''
      this.current_container.status = ''
      this.current_container.count = ''

      this.current_package.code = ''
      this.current_package.id = ''
      this.current_package.height = ''
      this.current_package.length = ''
      this.current_package.width = ''
      this.current_package.weight = ''
      this.current_package.order_number = ''
      this.current_package.tracking_number = ''
      this.current_package.status = ''
    },

    barcodeSubmit(keyword) {
      this.disableInput = true
      if (keyword.length > 22 && this.filter.type == 'package') {
        keyword = keyword.slice(-22)
      }
      this.keyword = keyword
      this.searchHandle()
      this.disableInput = false
    },

    handelModalConfirm(code) {
      this.visibleConfirm = true
      this.currentCode = code
    },

    async acceptSubmit() {
      if (!this.currentCode || this.isSubmitting) {
        return
      }

      this.isSubmitting = true
      let payload = {
        code: this.currentCode,
        type: this.filter.type,
      }
      const res = await this[SCAN_EXPORT_HUB](payload)

      if (!res.success) {
        this.isScan = false
        this.$toast.error(res.message)
        this.isSubmitting = false
        return
      }
      this.isSubmitting = false

      if (this.filter.type == 'container') {
        this.$toast.success(`Kiện ${payload.code} đã quét xuất hub thành công`)
        this.listExportedContainer.push(this.currentCode)
      } else if (this.filter.type == 'package') {
        this.$toast.success(`Đơn ${payload.code} đã quét xuất hub thành công`)
        this.listExportedPackage.push(this.currentCode)
      }
      this.isScan = false
      this.visibleConfirm = false
      this.init()
    },

    clearInput() {
      this.keyword = ''
      this.isScan = false
      this.currentCode = ''
      if (this.filter.type == 'container') {
        this.current_container.code = ''
        this.current_container.id = ''
        this.current_container.height = ''
        this.current_container.length = ''
        this.current_container.width = ''
        this.current_container.weight = ''
        this.current_container.tracking_number = ''
        this.current_container.status = ''
        this.current_container.count = ''
      } else if (this.filter.type == 'package') {
        this.current_package.code = ''
        this.current_package.id = ''
        this.current_package.height = ''
        this.current_package.length = ''
        this.current_package.width = ''
        this.current_package.weight = ''
        this.current_package.order_number = ''
        this.current_package.tracking_number = ''
        this.current_package.status = ''
      }
    },
  },
  watch: {
    filter: {
      handler: function () {
        this.init()
      },
      deep: true,
    },
  },
}
</script>
