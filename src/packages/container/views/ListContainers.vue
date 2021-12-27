<template>
  <div class="list-packages pages page__container">
    <div class="page-content">
      <div class="mb-12 ">
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
          <div class="page__container-search d-flex jc-sb col-6 ">
            <p-input
              placeholder="Tìm theo mã kiện, nhãn kiện hoặc mã vận đơn"
              suffixIcon="search"
              type="search"
              class="mr-8"
              :value="filter.search"
              @keyup.enter="handleSearch"
            >
            </p-input>
            <p-button type="info" @click="CreateContainerHandle">
              <p-icon name="plus"></p-icon>
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
            :count-status="count_status"
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
                      <th>Kích thước</th>
                      <th>Ngày tạo</th>
                      <th>Ngày đóng</th>
                      <th class="text-center">Số lượng đơn</th>
                      <th class="text-center">Tổng cân nặng</th>
                      <th>Trạng thái</th>
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
                            id: item.id,
                          },
                        }"
                      >
                        C{{ item.id }}
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
                    <td
                      >{{ item.length }} x {{ item.width }} x
                      {{ item.height }}</td
                    >
                    <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                    <td v-if="isCloseContainer(item)">{{
                      item.updated_at | date('dd/MM/yyyy')
                    }}</td>
                    <td v-else></td>
                    <td class="text-center">{{
                      item.container_items ? item.container_items.length : '0'
                    }}</td>
                    <td class="text-center">{{ item.weight }}</td>
                    <td>
                      <span
                        class="badge badge-round"
                        :class="mapStatus[item.status].class"
                        >{{ mapStatus[item.status].value }}</span
                      >
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
} from '../contants'
import { FETCH_LIST_CONTAINERS, CREATE_CONTAINER, GET_LABEL } from '../store'
import { FETCH_WAREHOUSE } from '../../shared/store'
import Browser from '@core/helpers/browser'
import api from '../api'
import { printImage } from '@core/utils/print'
import { cloneDeep } from '../../../core/utils'
export default {
  name: 'ListContainers',
  mixins: [mixinRoute, mixinTable],
  components: {
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
        warehouse: 1,
      },
      isFetching: false,
      visibleModalChoiceBox: false,
      loadingCreateContainer: false,
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
        return MAP_NAME_STATUS_CONTAINER
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
      let payload = cloneDeep(this.filter)
      let req = { type: 1, status: 1 }
      payload.search = payload.search.toUpperCase()
      const [result, result_1] = await Promise.all([
        this[FETCH_LIST_CONTAINERS](payload),
        this[FETCH_WAREHOUSE](req),
      ])
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
      if (!result_1.success) {
        this.$toast.open({ message: result_1.message, type: 'error' })
        return
      }
    },
    isCloseContainer(container) {
      return container.status === CONTAINER_CLOSE
    },
    CreateContainerHandle() {
      this.visibleModalChoiceBox = true
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
      handler: function() {
        this.init()
      },
      deep: true,
    },
  },
}
</script>
<style></style>
