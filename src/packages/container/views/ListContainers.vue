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
              v-model="keywordSearch"
              @input="checkClearSearch"
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
          <div class="p-tabs nav-tabs-horizontal mt-16 type-badge">
            <ul role="tablist" class="nav nav-tabs nav-tabs-line">
              <li
                role="presentation"
                class="nav-item"
                :class="{ active: k == filter.type }"
                v-for="(text, k) in containerTypes"
                :key="k"
              >
                <a href="#" class="nav-link" @click.prevent="changeType(k)">{{
                  text
                }}</a>
              </li>
            </ul>
          </div>
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="containers.length">
            <div class="table-responsive" style="overflow: revert">
              <table class="table table-hover" id="tbl-packages">
                <thead>
                  <tr>
                    <template>
                      <th>Mã kiện</th>
                      <th>Nhãn kiện</th>
                      <th>Mã lô</th>
                      <th>Ngày tạo</th>
                      <th>Ngày đóng</th>
                      <th width="90">Kích thước</th>
                      <th class="text-center">Số lượng đơn</th>
                      <th class="text-center">Tổng cân nặng</th>
                      <th class="text-center">Cân nặng thực tế</th>
                      <th>Loại</th>
                      <th>Trạng thái</th>
                      <th width="80"></th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in displayContainers" :key="i">
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
                    <td class="text-center">{{
                      item.actual_weight ? item.actual_weight : ''
                    }}</td>
                    <td>{{ item.type_text }}</td>
                    <td>
                      <span v-status="item.status" type="container"></span>
                    </td>
                    <td class="text-center">
                      <p-tooltip
                        :label="`Xem lịch sử`"
                        size="large"
                        position="top"
                        type="dark"
                        :active="true"
                      >
                        <p-svg
                          name="clock"
                          class="mr-8"
                          @click="showHistoryContainer(item)"
                        ></p-svg>
                      </p-tooltip>
                      <p-tooltip
                        :label="`Sửa tracking`"
                        size="large"
                        position="top"
                        type="dark"
                        :active="true"
                      >
                        <p-svg
                          name="update"
                          v-if="showBtnUpdate(item)"
                          @click="handleShowUpdateModal(item)"
                        ></p-svg>
                      </p-tooltip>
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
              >
              </p-pagination>
            </div>
          </template>
          <empty-search-result v-else></empty-search-result>
        </div>
      </div>
    </div>
    <modal-choice-shipping-box
      :warehouses="wareHouses"
      @save="createContainerSubmit"
      :visible.sync="visibleModalChoiceBox"
      :loading="loadingCreateContainer"
      :isCreate="true"
      :actionConfirm="'Tạo'"
      :cancel="'Bỏ qua'"
      :title="'Tạo kiện hàng'"
    >
    </modal-choice-shipping-box>
    <modal-history-container
      :visible.sync="visibleModalHistory"
      :histories="containerHistories"
    >
    </modal-history-container>
    <modal-update-container
      :loading="isSubmitting"
      @update="handleUpdateContainer"
      :tracking="container.tracking_number"
      :visible.sync="visibleUpdateModal"
    >
    </modal-update-container>
  </div>
</template>
<script>
import ContainerStatusTab from '../components/ContainerStatusTab'
import ModalChoiceShippingBox from '../components/ModalChoiceShippingBox'
import ModalUpdateContainer from '../components/ModalUpdateContainer'
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
  CONTAINER_TYPE_MANUAL,
  MAP_CONTAINER_TEXT_TYPES,
} from '../contants'
import {
  FETCH_LIST_CONTAINERS,
  CREATE_CONTAINER,
  GET_LABEL,
  UPDATE_CONTAINER,
} from '../store'
import { FETCH_WAREHOUSE } from '../../shared/store'
import Browser from '@core/helpers/browser'
import api from '../api'
import { printImage } from '@core/utils/print'
import { cloneDeep } from '../../../core/utils'
import ModalHistoryContainer from '../components/ModalHistoryContainer'
import { WAREHOUSE_TYPE_INTERNATIONAL } from '../../shipment/constants'

export default {
  name: 'ListContainers',
  mixins: [mixinRoute, mixinTable],
  components: {
    ModalHistoryContainer,
    EmptySearchResult,
    ContainerStatusTab,
    ModalChoiceShippingBox,
    ModalUpdateContainer,
  },
  data() {
    return {
      filter: {
        limit: 30,
        page: 1,
        status: '',
        search: '',
        warehouse: '',
        type: CONTAINER_TYPE_MANUAL,
      },
      keywordSearch: '',
      isSubmitting: false,
      isFetching: false,
      visibleUpdateModal: false,
      container: {},
      visibleModalChoiceBox: false,
      loadingCreateContainer: false,
      visibleModalHistory: false,
      containerHistories: [],
      containerTypes: MAP_CONTAINER_TEXT_TYPES,
    }
  },
  created() {
    this.filter = this.getRouteQuery()
  },
  computed: {
    ...mapState('container', {
      containers: (state) => state.containers,
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
        if (!this.count_status) return
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

      displayContainers() {
        return (this.containers || []).map((item) => {
          item.type_text =
            item.type != CONTAINER_TYPE_MANUAL ? 'Label Lionbay' : 'Label ngoài'
          return item
        })
      },
    }),
  },
  methods: {
    ...mapActions('container', [
      FETCH_LIST_CONTAINERS,
      CREATE_CONTAINER,
      GET_LABEL,
      UPDATE_CONTAINER,
    ]),
    ...mapActions('shared', [FETCH_WAREHOUSE]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()

      let req = { type: WAREHOUSE_TYPE_INTERNATIONAL }
      const result = await this[FETCH_WAREHOUSE](req)
      if (!result.success) {
        this.isFetching = false
        this.$toast.open({ message: result.message, type: 'error' })
      }
      if (!this.filter.warehouse) {
        const wareHouseActive = this.wareHouses.find(
          ({ type }) => type == WAREHOUSE_TYPE_INTERNATIONAL
        )
        if (!wareHouseActive) {
          this.isFetching = false
          return
        }

        this.filter.warehouse = wareHouseActive.id
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
    showBtnUpdate(container) {
      return (
        container.type === CONTAINER_TYPE_MANUAL &&
        [CONTAINER_CLOSE].includes(container.status)
      )
    },
    handleShowUpdateModal(container) {
      this.visibleUpdateModal = true
      this.container = container
    },
    async handleUpdateContainer(tracking) {
      const regex = /^[a-z0-9]+$/i
      if (tracking.trim() != '' && !regex.test(tracking.trim())) {
        this.$toast.open({
          message: 'Tracking chỉ chứa chữ số và chữ cái',
          type: 'error',
        })
        return
      }

      this.isSubmitting = true
      const payload = {
        id: parseInt(this.container.id),
        tracking_number: tracking.trim().toUpperCase(),
      }
      const result = await this[UPDATE_CONTAINER](payload)
      console.log(result)
      if (!result.success) {
        this.$toast.open({
          message: result.message,
          type: 'error',
        })
        return
      }
      this.isSubmitting = false
      this.visibleUpdateModal = false
      this.$toast.open({
        message: `Cập nhật kiện hàng thành công`,
        type: 'success',
      })
      await this.init()
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
      if (body.warehouse_id == 0) {
        this.$toast.error('Chưa chọn kho')
        return
      }

      if (body.type == 0) {
        this.$toast.error('Chưa chọn kiểu kiện')
        return
      }

      this.loadingCreateContainer = true
      const result = await this[CREATE_CONTAINER](body)
      this.loadingCreateContainer = false
      this.visibleModalChoiceBox = false

      if (!result.success) {
        this.$toast.error(result.message)
        return
      }

      this.$toast.success('Tạo kiện hàng thành công')

      this.filter.page = 1
      this.filter.type = body.type
      this.filter.warehouse = body.warehouse_id

      this.init()
    },
    handleFilter(id) {
      this.filter.page = 1
      this.filter.warehouse = id
    },
    changeType(v) {
      this.filter.page = 1
      this.filter.type = v
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
