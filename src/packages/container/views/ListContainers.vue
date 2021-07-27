<template>
  <div class="list-packages pages">
    <div class="page-content">
      <div class="row mb-12">
        <div class="col-12" id="search-box">
          <p-input
            placeholder="Tìm theo mã kiện, nhãn kiện hoặc mã vận đơn"
            prefixIcon="search"
            type="search"
            :value="filter.search"
            @keyup.enter="handleSearch"
          >
          </p-input>
          <p-button type="info" @click="CreateContainerHandle">
            <img src="~@/assets/img/plus.svg" alt="" />
            Tạo kiện hàng
          </p-button>
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
                      <th>Ngày tạo</th>
                      <th>Ngày đóng</th>
                      <th class="text-center">Số lượng đơn</th>
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
                        <img src="@/assets/img/barcode.svg" alt="barcode" />
                      </span>
                    </td>
                    <td>
                      <a
                        class="text-no-underline"
                        v-if="item.tracking_number"
                        href="javascript:void(0)"
                        @click="downloadLabel(item.label_url)"
                        >{{ item.tracking_number }}</a
                      >
                    </td>
                    <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                    <td v-if="isCloseContainer(item)">{{
                      item.updated_at | date('dd/MM/yyyy')
                    }}</td>
                    <td v-else></td>
                    <td class="text-center">{{
                      item.container_items ? item.container_items.length : '0'
                    }}</td>
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
      @save="createContainerSubmit"
      :visible.sync="visibleModalChoiceBox"
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
import Browser from '@core/helpers/browser'
import api from '../api'
import { printImage } from '@core/utils/print'
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
      },
      isFetching: false,
      visibleModalChoiceBox: false,
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
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      const result = await this[FETCH_LIST_CONTAINERS](this.filter)
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
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
          message: 'Box type is required',
        })
        return
      }
      const result = await this[CREATE_CONTAINER](body)
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
#search-box .input-group {
  width: calc(100% - 166px);
  float: left;
  margin-right: 10px;
}
</style>
