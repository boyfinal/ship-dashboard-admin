<template>
  <div class="list-packages pages page__container">
    <div class="page-content">
      <div class="mb-12">
        <div class="d-flex jc-sb row" id="search-box">
          <div class="page__container-warehouses col-6">
            <button
              v-for="(warehouse, i) in wareHouses"
              :key="i"
              :class="{ active: warehouse.id == filter.warehouse }"
              @click="handleFilter(warehouse.id)"
              class="choose-warehouse btn btn-default mr-8 mb-8"
            >
              HUB {{ warehouse ? warehouse.state : '' }}
            </button>
          </div>
          <div class="page__container-search d-flex jc-sb col-6">
            <p-input
              placeholder="Tìm theo mã kiện, nhãn kiện hoặc LionBay tracking"
              prefixIcon="search"
              type="search"
              class="mr-8"
              clearable
              :value="filter.search"
              @keyup.enter="handleSearch"
              @clear="clearSearch"
            >
            </p-input>
            <p-button type="info" @click="CreateContainerHandle">
              <svgicon name="plus" class="text-white add_container" />
              Tạo kiện hàng
            </p-button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <container-status-tab
            :has-all="false"
            :status="statusTab"
            v-model="filter.status"
            :count-status="coverCountStatus"
          />
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="containers.length">
            <div class="table-responsive">
              <table class="table table-hover" id="tbl-packages">
                <thead>
                  <tr>
                    <template>
                      <th>Mã kiện</th>
                      <th>Nhãn kiện</th>
                      <th>Mã lô</th>
                      <th>Ngày tạo</th>
                      <th>Ngày đóng</th>
                      <th>Kích thước</th>
                      <th class="text-center">Số lượng đơn</th>
                      <th class="text-center">Tổng cân nặng</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in containers" :key="i">
                    <td>
                      <router-link
                        class="text-no-underline"
                        :to="{
                          name: 'container-detail',
                          params: {
                            code: item.code ? item.code : '',
                          },
                        }"
                      >
                        {{ item.code ? item.code : '' }}
                      </router-link>
                      <span
                        class="page-header__barcode"
                        @click="printBarcode(item.barcode)"
                      >
                        <p-svg name="barcode"></p-svg>
                      </span>
                    </td>
                    <td>
                      <a
                        class="text-no-underline on-hover"
                        v-if="item.tracking_number"
                        href="javascript:void(0)"
                        @click="downloadLabel(item.label_url)"
                        >{{ item.tracking_number }}</a
                      >
                    </td>
                    <td>
                      <router-link
                        :to="{
                          name: 'shipment-detail',
                          params: {
                            id: item.shipment_id,
                          },
                        }"
                      >
                        {{ item.shipment_id }}
                      </router-link>
                    </td>
                    <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                    <td v-if="item.close_at">{{
                      item.close_at | date('dd/MM/yyyy')
                    }}</td>
                    <td v-else></td>
                    <td
                      >{{ item.length }} x {{ item.width }} x
                      {{ item.height }}</td
                    >
                    <td class="text-center">{{ item.count_item }}</td>
                    <td class="text-center">{{ item.weight }}</td>
                    <td>
                      <span v-status="item.status" type="container"></span>
                    </td>
                    <td>
                      <p-button
                        class="btn btn-info ml-3 text-nowrap"
                        @click="showHistoryContainer(item)"
                      >
                        Xem lịch sử
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
    <modal-choice-shipping-box
      :boxes="boxes"
      :warehouses="wareHouses"
      @save="createContainerSubmit"
      :visible.sync="visibleModalChoiceBox"
      :loading="loadingCreateContainer"
    >
    </modal-choice-shipping-box>
    <modal-history-container
      :visible.sync="visibleModalHistory"
      :histories="containerHistories"
    >
    </modal-history-container>
  </div>
</template>
<script>
import ContainerStatusTab from '../components/ContainerStatusTab'
import ModalChoiceShippingBox from '../components/ModalChoiceShippingBox'
import { mapState, mapActions } from 'vuex'

import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'

import {
  CONTAINER_STATUS_TAB,
  MAP_NAME_STATUS_CONTAINER,
  CONTAINER_CLOSE,
  CONTAINER_DELIVERIED,
  CONTAINER_IMPORT_HUB,
  CONTAINER_EXPORT_HUB,
} from '../contants'
import { FETCH_LIST_CONTAINERS, CREATE_CONTAINER, GET_LABEL } from '../store'
import { FETCH_WAREHOUSE } from '../../shared/store'
import Browser from '@core/helpers/browser'
import api from '../api'
import { printImage } from '@core/utils/print'
import { cloneDeep } from '../../../core/utils'
import ModalHistoryContainer from '../components/ModalHistoryContainer'
export default {
  name: 'ListContainers',
  mixins: [mixinRoute, mixinTable],
  components: {
    ModalHistoryContainer,
    EmptySearchResult,
    ContainerStatusTab,
    ModalChoiceShippingBox,
  },
  data() {
    return {
      filter: {
        limit: 30,
        page: 1,
        status: '',
        search: '',
        warehouse: '',
      },
      isFetching: false,
      visibleModalChoiceBox: false,
      loadingCreateContainer: false,
      visibleModalHistory: false,
      containerHistories: [],
    }
  },
  created() {
    this.filter = this.getRouteQuery()
  },
  computed: {
    ...mapState('container', {
      containers: (state) => state.containers,
      boxes: (state) => state.boxes,
      count: (state) => state.count,
      count_status: (state) => state.count_status,
      statusTab() {
        return CONTAINER_STATUS_TAB
      },

      ...mapState('shared', {
        wareHouses: (state) => state.wareHouses,
      }),
      mapStatus() {
        let status = cloneDeep(MAP_NAME_STATUS_CONTAINER)
        Object.keys(status).map((x) => {
          if (x == CONTAINER_EXPORT_HUB || x == CONTAINER_IMPORT_HUB) {
            status[x].value = 'Đã giao'
            status[x].class = 'badge-info'
          }
        })
        return status
      },
      coverCountStatus() {
        const reduce = this.count_status
          .filter(
            (obj) =>
              obj.status == CONTAINER_IMPORT_HUB ||
              obj.status == CONTAINER_EXPORT_HUB ||
              obj.status == CONTAINER_DELIVERIED
          )
          .map((item) => item.count)
          .reduce((t, n) => t + n, 0)
        const temp = this.count_status.map((obj) =>
          obj.status == CONTAINER_DELIVERIED ||
          obj.status == CONTAINER_IMPORT_HUB ||
          obj.status == CONTAINER_EXPORT_HUB
            ? { status: CONTAINER_DELIVERIED, count: reduce }
            : obj
        )
        return temp
      },
    }),
  },
  methods: {
    ...mapActions('container', [
      FETCH_LIST_CONTAINERS,
      CREATE_CONTAINER,
      GET_LABEL,
    ]),
    ...mapActions('shared', [FETCH_WAREHOUSE]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()

      let req = { type: 1, status: 1 }
      const result = await this[FETCH_WAREHOUSE](req)
      if (!result.success) {
        this.isFetching = false
        this.$toast.open({ message: result.message, type: 'error' })
      }
      if (!this.filter.warehouse) {
        let wareHouseActive = this.wareHouses.filter(
          (ele) => ele.status == 1 && ele.type == 1
        )
        if (wareHouseActive.length < 1) {
          this.isFetching = false
          return
        }
        this.filter.warehouse = wareHouseActive[0].id
      }

      let payload = cloneDeep(this.filter)
      payload.search = payload.search.toUpperCase()

      const result_1 = await this[FETCH_LIST_CONTAINERS](payload)
      if (!result_1.success) {
        this.isFetching = false
        this.$toast.open({ message: result_1.message, type: 'error' })
        return
      }
      this.isFetching = false
    },
    isCloseContainer(container) {
      return container.status === CONTAINER_CLOSE
    },
    CreateContainerHandle() {
      this.visibleModalChoiceBox = true
    },
    showHistoryContainer(container) {
      this.containerHistories = container.container_history
      this.visibleModalHistory = true
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
    async printBarcode(barcode) {
      document.activeElement && document.activeElement.blur()

      const res = await api.downloadLabel({
        url: barcode,
        type: 'labels',
      })
      if (!res && res.error) {
        this.$toast.open({
          type: 'error',
          message: res.errorMessage,
          duration: 3000,
        })
        return
      }

      try {
        let blob = (window.webkitURL || window.URL).createObjectURL(res)
        printImage(blob)
      } catch (error) {
        this.$toast.error('File error !!!')
      }
    },
    async createContainerSubmit(body) {
      if (body.box_type_id == 0) {
        this.$toast.open({
          type: 'error',
          message: 'Chưa chọn loại',
        })
        return
      }
      if (body.warehouse_id == 0) {
        this.$toast.open({
          type: 'error',
          message: 'Chưa chọn kho',
        })
        return
      }
      this.loadingCreateContainer = true
      const result = await this[CREATE_CONTAINER](body)
      this.loadingCreateContainer = false
      this.visibleModalChoiceBox = false
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
        })
        return
      }

      this.$toast.open({
        type: 'success',
        message: 'Tạo kiện hàng thành công',
      })
      this.init()
    },
    handleFilter(id) {
      this.filter.page = 1
      this.filter.warehouse = id
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
<style></style>
