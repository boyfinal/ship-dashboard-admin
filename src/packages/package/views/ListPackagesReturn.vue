<template>
  <div class="list-packages pages">
    <div class="page-content">
      <div class="d-flex jc-sb mb-12 search-input">
        <p-input
          :placeholder="searchPlaceholder"
          prefixIcon="search"
          type="search"
          :clearable="true"
          :value.sync="keywordSearch"
          @keyup.enter="handleSearch"
          @clear="clearSearch"
        >
        </p-input>
        <p-select
          class="ml-8"
          style="width: 20%"
          placeholder="Please select"
          v-model="filter.search_by"
        >
          <option :value="key" v-for="(value, key) in searchBy" :key="key">
            {{ value }}
          </option>
        </p-select>
      </div>
      <div class="card">
        <div class="card-body">
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="packages.length">
            <div class="table-responsive" style="overflow: unset">
              <table class="table table-hover" id="tbl-packages">
                <thead>
                  <tr>
                    <th>order no.</th>
                    <th>lionbay tracking</th>
                    <th>last mile tracking</th>
                    <th>Khách hàng</th>
                    <th>Ngày trả hàng</th>
                    <th>Ngày kho nhận</th>
                    <th>Trạng thái</th>
                    <th v-if="showBtn"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in packages" :key="i">
                    <td>
                      <p-tooltip
                        :label="item.order_number"
                        v-if="item.order_number"
                        size="large"
                        position="top"
                        type="dark"
                        :active="item.order_number.length > 20"
                      >
                        <router-link
                          class="text-no-underline"
                          :to="{
                            name: 'package-detail',
                            params: {
                              id: item.package_id,
                            },
                          }"
                        >
                          {{ truncate(item.order_number, 20) }}
                        </router-link>
                      </p-tooltip>
                    </td>
                    <td class="text-nowrap code">
                      <span v-if="item.package_code">
                        {{ item.package_code }}
                      </span>
                      <span
                        v-else
                        :class="{ 'no-track-code': totalSelected <= 0 }"
                      >
                        N/A
                      </span>
                    </td>
                    <td class="text-nowrap">
                      <div v-if="item.tracking_number">
                        {{ item.tracking_number }}</div
                      >
                      <span
                        :class="{ 'no-track-code': totalSelected <= 0 }"
                        v-else
                        >N/A</span
                      >
                    </td>
                    <td>
                      {{ item.full_name }}
                    </td>
                    <td>
                      <span v-if="item.returned_at">
                        {{ item.returned_at | date('dd/MM/yyyy') }}
                      </span>
                      <span v-else>N/A</span>
                    </td>
                    <td>
                      <span v-if="item.hub_imported_at">{{
                        item.hub_imported_at | date('dd/MM/yyyy')
                      }}</span>
                      <span v-else>N/A</span>
                    </td>
                    <td>{{
                      item.package_return_id ? `Đã gửi lý do` : `Chưa gửi lý do`
                    }}</td>
                    <td v-if="showBtn">
                      <p-button
                        type="info"
                        class="ml-7"
                        @click="handleModal(item.package_id)"
                      >
                        Re-ship
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
    <OverLoading :is-loading="isSubmitting" />
    <modal-edit-order
      :is-re-label="true"
      :visible.sync="isVisibleModal"
      @submit="handleUpdate"
      :total="0"
      :package-id="reshipID"
    >
    </modal-edit-order>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { truncate } from '@core/utils/string'
import mixinDownload from '@/packages/shared/mixins/download'
import ModalEditOrder from '../components/ModalEditOrder'
import OverLoading from '@components/shared/OverLoading'
import {
  MAP_NAME_STATUS_STRING_PACKAGE,
  PACKAGE_ALERT_TYPE_HUB_RETURN,
} from '../constants'
import { FETCH_LIST_PACKAGES_RETURN, UPDATE_PACKAGE } from '../store'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'

export default {
  name: 'ListPackagesReturn',
  mixins: [mixinRoute, mixinTable, mixinDownload],
  components: {
    EmptySearchResult,
    ModalEditOrder,
    OverLoading,
  },
  data() {
    return {
      filter: {
        limit: 30,
        status: '',
        search: '',
        search_by: 'code',
        code: '',
      },
      isSubmitting: false,
      isVisibleModal: false,
      reshipID: 0,
      isUploading: false,
      keywordSearch: '',
      isFetching: false,
      searchBy: {
        code: 'LionBay tracking',
        order_number: 'Mã đơn hàng',
        recipient: 'Người nhận',
        account: 'Tài khoản khách hàng',
        customer_full_name: 'Tên khách hàng',
        tracking: 'Last mile tracking',
      },
    }
  },
  created() {
    this.filter = this.getRouteQuery()
    this.keywordSearch = this.filter.search.trim()
  },
  computed: {
    ...mapState('package', {
      packages: (state) => state.returnPackages,
      count: (state) => state.countReturnPackages,
    }),
    showDetailPackage() {
      return !this.$isAccountant() && !this.$isSupport()
    },
    mapStatus() {
      return MAP_NAME_STATUS_STRING_PACKAGE
    },
    showBtn() {
      return this.$isAdmin() || this.$isSupport()
    },
    searchPlaceholder() {
      const maptext = {
        id: 'Tìm theo mã hoá đơn',
        code: 'Tìm theo LionBay tracking',
        recipient: 'Tìm theo tên người nhận',
        account: 'Tìm theo email hoặc sđt của khách hàng',
        order_number: 'Tìm theo mã đơn hàng',
        customer: 'Tìm theo email hoặc sđt của khách hàng',
        customer_full_name: 'Tìm theo tên khách hàng',
        tracking: 'Tìm theo last mile tracking',
      }

      return maptext[this.filter.search_by] || maptext['id']
    },
  },
  methods: {
    ...mapActions('package', [FETCH_LIST_PACKAGES_RETURN, UPDATE_PACKAGE]),
    truncate,
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      this.keywordSearch = this.filter.search.trim()
      const payload = {
        ...this.filter,
        ...{ alert: PACKAGE_ALERT_TYPE_HUB_RETURN },
      }
      const result = await this[FETCH_LIST_PACKAGES_RETURN](payload)
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
    },
    handleModal(packge_id) {
      this.reshipID = packge_id
      this.isVisibleModal = true
    },
    async handleUpdate(params) {
      this.isVisibleModal = false

      if (this.isSubmitting) return

      this.isSubmitting = true
      params.id = this.reshipID
      let result = await this[UPDATE_PACKAGE](params)
      this.isSubmitting = false
      if (result.error) {
        this.$toast.error(result.message, { duration: 3000 })
        return
      }
      this.$toast.success('Reship hàng thành công', { duration: 3000 })
      await this.init()
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

<style scoped lang="scss">
.p-tooltip::after {
  z-index: 9999;
  white-space: pre;
  width: auto;
}
td.code {
  max-width: 20vw !important;
  span.link-code,
  span.svg {
    position: relative;
    top: 3px;
  }
}
.no-track-code,
.no-pkg-code {
  position: relative;
  left: 50px;
  display: inline-block;
}
</style>
