<template>
  <div class="list__shipment pages">
    <div class="page-content">
      <div class="mb-12 row">
        <div class="warehouse col-6">
          <button
            class="btn btn-warehouse mb-8"
            v-for="(item, i) in wareHouses"
            :key="i"
            :class="{ active: filter.warehouseID == item.id }"
            @click="selectWarehouse(item.id)"
            >HUB {{ item ? item.state : '' }}</button
          >
        </div>
        <div class="d-flex jc-sb col-6" id="search-box">
          <p-input
            placeholder="Tìm theo mã lô hoặc mã kiện"
            prefixIcon="search"
            type="search"
            clearable
            @keyup.enter="handleSearch"
            :value="filter.search"
            @clear="clearSearch"
          >
          </p-input>
          <p-button @click="visibleModal" type="info">
            <svgicon name="plus" class="text-white" />
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
                      <th width="200">Mã lô</th>
                      <th>Ngày tạo</th>
                      <th>Ngày đóng</th>
                      <th width="150" style="text-align: center"
                        >Tổng cân nặng</th
                      >
                      <th width="150" style="text-align: center"
                        >Số lượng kiện</th
                      >
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
                    <td style="text-align: center">{{
                      item.quantity > 0 ? sumWeight(item.containers) : 0
                    }}</td>
                    <td style="text-align: center">
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
    <!-- <modal-confirm
      :visible.sync="visibleConfirm"
      :actionConfirm="`Có`"
      :cancel="`Không`"
      :description="`Bạn có muốn tạo lô hàng ?`"
      :title="`Xác nhận`"
      @action="handleCreate"
      :size="`sm`"
    ></modal-confirm> -->
    <modal-choice-warehouse
      :warehouses="wareHouses"
      @save="handleCreate"
      :visible.sync="visibleConfirm"
      :loading="loadingCreateWarehouse"
    >
    </modal-choice-warehouse>
  </div>
</template>
<script>
import {
  SHIPMENT_STATUS_TAB,
  ShipmentClosed,
  WareHouseStatusActive,
  WareHouseTypeInternational,
} from '../constants'
import { MAP_NAME_STATUS_SHIPMENT } from '../constants'
import { mapState, mapActions } from 'vuex'

import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { FETCH_LIST_SHIPMENT, CREATE_SHIPMENT } from '../store'
import ShipmentStatusTab from '../components/ShipmentStatusTab'
import ModalChoiceWarehouse from '../components/ModalChoiceWarehouse'
import { cloneDeep } from '../../../core/utils'
import { FETCH_WAREHOUSE } from '../../shared/store'

export default {
  name: 'ListShipment',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    ShipmentStatusTab,
    ModalChoiceWarehouse,
  },
  data() {
    return {
      filter: {
        limit: 30,
        search: '',
        status: '',
        warehouseID: 1,
      },
      isFetching: false,
      visibleConfirm: false,
      ShipmentClosed: ShipmentClosed,
      loadingCreateWarehouse: false,
      WareHouseStatusActive,
      WareHouseTypeInternational,
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
      ...mapState('shared', {
        wareHouses: (state) => state.wareHouses,
      }),
      mapStatus() {
        return MAP_NAME_STATUS_SHIPMENT
      },
    }),
  },
  methods: {
    ...mapActions('shipment', [FETCH_LIST_SHIPMENT, CREATE_SHIPMENT]),
    ...mapActions('shared', [FETCH_WAREHOUSE]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      let payload = cloneDeep(this.filter)
      let req = {
        type: this.WareHouseTypeInternational,
        status: this.WareHouseStatusActive,
      }
      payload.search = payload.search.toUpperCase()
      const [result, result_1] = await Promise.all([
        this[FETCH_LIST_SHIPMENT](payload),
        this[FETCH_WAREHOUSE](req),
      ])
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
      if (!result_1.success) {
        this.$toast.open({ message: result_1.message, type: 'error' })
        return
      }
    },
    async handleCreate(body) {
      if (body.warehouse_id == 0) {
        this.$toast.open({
          type: 'error',
          message: 'Warehouse id is required',
        })
        return
      }
      this.loadingCreateWarehouse = true
      const result = await this[CREATE_SHIPMENT](body)
      this.loadingCreateWarehouse = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
      this.$toast.open({ message: 'Tạo lô thành công', type: 'success' })
      this.visibleConfirm = false
      this.init()
    },

    selectWarehouse(id) {
      this.filter.page = 1
      if (this.filter.warehouseID == id) return
      this.filter.warehouseID = id
    },
    sumWeight(containers) {
      return containers
        .map((item) => item.weight)
        .reduce((prev, curr) => prev + curr, 0)
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
<style lang="scss">
.list__shipment {
  #search-box .input-group {
    margin-right: 8px;
  }
  .p-input-search {
    padding-left: 18px;
  }
  .btn-info {
    white-space: nowrap;
  }
  .btn-warehouse {
    background: #ffffff;
    margin-right: 8px;
    color: #626363;
    font-weight: 600;

    border: 1px solid #edeeee;
    &:hover,
    &.active {
      border: 1px solid #00b4c3;
      color: #00b4c3;
    }
    &:focus {
      box-shadow: unset;
    }
  }
}
</style>
