<template>
  <div class="list__shipment pages">
    <div class="page-content">
      <div class="row mb-12">
        <div class="col-12" id="search-box">
          <p-input
            placeholder="Tìm theo mã lô hoặc mã kiện"
            suffixIcon="search"
            type="search"
          >
          </p-input>
          <p-button type="info">
            <img src="~@/assets/img/plus.svg" alt="" />
            Tạo lô hàng
          </p-button>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <status-tab
            :has-all="false"
            v-model="filter.status"
            :status="statusTab"
            :count="0"
          />
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="containers.length">
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
                  <tr v-for="(item, i) in containers" :key="i">
                    <td>
                      {{ item.code }}
                    </td>
                    <td>{{ item.created_at }}</td>
                    <td>{{ item.updated_at }}</td>
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
                :filter-limit="false"
                :total="1"
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
</template>
<script>
import { SHIPMENT_STATUS_TAB } from '../constants'
import { MAP_NAME_STATUS_SHIPMENT } from '../constants'
export default {
  name: 'ListShipment',
  data() {
    return {
      filter: {
        limit: 30,
        search: '',
        status: '',
      },
      isFetching: false,
      containers: [
        {
          code: 1,
          created_at: '22/12/2012',
          updated_at: '22/12/2012',
          quantity: 1,
          status: 1,
        },
      ],
    }
  },
  computed: {
    statusTab() {
      return SHIPMENT_STATUS_TAB
    },
    mapStatus() {
      return MAP_NAME_STATUS_SHIPMENT
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
