<template>
  <div class="package-detail pages">
    <div class="page-content">
      <div class="page-header">
        <div class="page-header_back">
          <router-link :to="{ name: 'list-package' }" class="text">
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
            <p-input
              placeholder="Tìm theo mã kiện hàng"
              prefixIcon="search"
              type="search"
              :value="filter.search"
              @keyup.enter="handleSearch"
            >
            </p-input>
            <p-button type="info">
              Thêm
            </p-button>
          </div>
          <div class="page-header__action">
            <p-button type="info">
              Bắt đầu quét
            </p-button>
            <p-button type="primary">
              Đóng lô hàng
            </p-button>
            <p-button type="danger">
              Hủy lô hàng
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
                      <th width="40">
                        <p-checkbox
                          class="order-select-checkbox"
                          :class="{ checkAll: totalSelected > 0 }"
                          :style="totalSelected > 0 && { width: 0 }"
                          :value="isAllChecked"
                          @change.native="toggleSelectAll"
                          :indeterminate="isIndeterminate"
                        ></p-checkbox>
                      </th>
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
                      <td width="40">
                        <p-checkbox
                          v-model="action.selected"
                          :native-value="item"
                        ></p-checkbox>
                      </td>
                      <td>{{ item.code }}</td>
                      <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                      <td>
                        <a :href="item.label_url">{{ item.tracking_number }}</a>
                      </td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ item.weight }}</td>
                      <td>
                        {{ getBoxInfo(item) }}
                      </td>
                      <td>
                        <p-button type="danger">
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
import { FETCH_SHIPMENT_DETAIL } from '../store'
import { cloneDeep } from '../../../core/utils'
import EmptySearchResult from '@components/shared/EmptySearchResult'
export default {
  name: 'ShipmentDetail',
  mixins: [mixinRoute, mixinTable],
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
    }
  },
  computed: {
    ...mapState('shipment', {
      shipment: (state) => state.shipment,
      containers: (state) => state.containers,
      count: (state) => state.container_count,
    }),
    items() {
      return this.containers
    },
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('shipment', [FETCH_SHIPMENT_DETAIL]),
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
      return container.box
        ? `${container.box.length} x ${container.box.width}  x ${container.box.height}`
        : null
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
