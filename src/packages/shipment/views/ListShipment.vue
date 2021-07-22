<template>
  <div class="list__shipment pages">
    <div class="page-content">
      <div class="row mb-12">
        <div class="col-12" id="search-box">
          <p-input
            placeholder="Tìm theo mã lô hoặc mã kiện,ID kiện  "
            prefixIcon="search"
            type="search"
            clearable
            @keyup.enter="handleSearch"
            :value="filter.search"
            @clear="clearSearch"
          >
          </p-input>
          <p-button @click="visibleModal" type="info">
            <img src="~@/assets/img/plus.svg" alt="" />
            Tạo lô hàng
          </p-button>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <shipment-status-tab
            :has-all="false"
            v-model="filter.status"
            :status="statusTab"
            :count-status="count_status"
          />
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="shipments.length">
            <div class="table-responsive">
              <table class="table table-hover" id="tbl-packages">
                <thead>
                  <tr>
                    <template>
                      <th>Mã lô</th>
                      <th>Ngày tạo</th>
                      <th>Ngày đóng</th>
                      <th>Số lượng kiện</th>
                      <th>Trạng thái</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in shipments" :key="i">
                    <td>
                      <router-link
                        class="text-no-underline"
                        :to="{
                          name: 'shipment-detail',
                          params: {
                            id: item.id,
                          },
                        }"
                      >
                        {{ item.id }}
                      </router-link>
                    </td>
                    <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                    <td v-if="item.status != ShipmentClosed">-</td>
                    <td v-else>{{ item.updated_at | date('dd/MM/yyyy') }}</td>
                    <td>
                      {{ item.quantity }}
                    </td>
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
    <modal-confirm
      :visible.sync="visibleConfirm"
      :actionConfirm="`Có`"
      :cancel="`Không`"
      :description="`Bạn có muốn tạo lô hàng ?`"
      :title="`Xác nhận`"
      @action="handleCreate"
      :size="`sm`"
    ></modal-confirm>
  </div>
</template>
<script>
import { SHIPMENT_STATUS_TAB, ShipmentClosed } from '../constants'
import { MAP_NAME_STATUS_SHIPMENT } from '../constants'
import { mapState, mapActions } from 'vuex'

import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { FETCH_LIST_SHIPMENT, CREATE_SHIPMENT } from '../store'
import ShipmentStatusTab from '../components/ShipmentStatusTab'
import ModalConfirm from '../../../components/shared/modal/ModalConfirm'

export default {
  name: 'ListShipment',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    ShipmentStatusTab,
    ModalConfirm,
  },
  data() {
    return {
      filter: {
        limit: 30,
        search: '',
        status: '',
      },
      isFetching: false,
      visibleConfirm: false,
      ShipmentClosed: ShipmentClosed,
    }
  },
  created() {
    this.filter = this.getRouteQuery()
  },
  computed: {
    ...mapState('shipment', {
      shipments: (state) => state.shipments,
      count: (state) => state.count,
      count_status: (state) => state.count_status,
      statusTab() {
        return SHIPMENT_STATUS_TAB
      },
      mapStatus() {
        return MAP_NAME_STATUS_SHIPMENT
      },
    }),
  },
  methods: {
    ...mapActions('shipment', [FETCH_LIST_SHIPMENT, CREATE_SHIPMENT]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      const result = await this[FETCH_LIST_SHIPMENT](this.filter)
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
    },
    async handleCreate() {
      const result = await this[CREATE_SHIPMENT]()
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
      this.$toast.open({ message: 'Tạo lô thành công', type: 'success' })
      this.visibleConfirm = false
      this.init()
    },
    visibleModal() {
      this.visibleConfirm = true
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
