<template>
  <div class="pages packages__return">
    <div class="page-header">
      <div class="d-flex jc-sb mb-12 search-input">
        <p-input
          placeholder="Nhập mã đơn"
          prefixIcon="search"
          type="search"
          clearable
          v-model="filter.search"
          @keyup.enter="searchHandle"
          @clear="clearSearch"
        >
        </p-input>
        <p-button
          id="export-btn"
          @click="searchHandle"
          class="btn btn-info ml-3 text-nowrap"
          >Quét</p-button
        >
      </div>
    </div>
    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="items.length">
            <div class="table-responsive">
              <table class="table table-hover" id="tbl-packages">
                <thead>
                  <tr>
                    <template>
                      <th>MÃ ĐƠN HÀNG</th>
                      <th>LIONBAY TRACKING</th>
                      <th>NGÀY RETURN</th>
                      <th>NGÀY NHẬP KHO</th>
                      <th>TRẠNG THÁI</th>
                      <th></th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in displayItems" :key="i">
                    <td>
                      <router-link
                        class="package-id"
                        :to="item.route"
                        v-if="$isAdmin()"
                      >
                        #{{ item.id }}
                      </router-link>
                      <a href="#" class="package-id" v-else> #{{ item.id }} </a>
                    </td>

                    <td>{{ item.code }}</td>
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
                    <td>
                      <span
                        class="reason"
                        :class="item.package_return_id ? `sent` : ''"
                      >
                        {{ item.status_text }}
                      </span>
                    </td>
                    <td class="text-right">
                      <button
                        class="btn btn-outline-info"
                        @click="showModalReturnHandle(item)"
                        >Lý do</button
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
                :filterLimit="true"
                size="sm"
              ></p-pagination>
            </div>
          </template>
          <empty-search-result v-else></empty-search-result>
        </div>
      </div>
    </div>
    <ModalReturn
      :visible.sync="isShowModalReturn"
      :submit="returnHandle"
      :current="current"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import {
  FETCH_PACKAGE_DETAIL,
  HUB_COUNT_SEARCH_ITEMS,
  HUB_RETURN,
  HUB_SEARCH_ITEMS,
} from '../store'
import { HUB_TAB_IDS } from '../constants'
import ModalReturn from '../components/ModalReturn'
export default {
  name: 'ListReturn',
  mixins: [mixinRoute, mixinTable],
  components: { EmptySearchResult, ModalReturn },
  data() {
    return {
      isFetching: false,
      filter: {
        search: '',
        page: 1,
        limit: 20,
        status: 'return',
      },
      isShowModalReturn: false,
      current: {},
    }
  },
  created() {
    this.filter = this.getRouteQuery()
    this.searchHandle()
  },
  computed: {
    ...mapState('hub', {
      items: (state) => state.items,
      count: (state) => state.count,
    }),
    displayItems() {
      return this.items.map((item) => {
        item.status_text = item.package_return_id
          ? 'Đã gửi lý do'
          : 'Chưa gửi lý do'

        item.route = { name: 'package-detail', params: { id: item.id } }
        return item
      })
    },
  },
  methods: {
    ...mapActions('hub', {
      searchSubmit: HUB_SEARCH_ITEMS,
      countSearchSubmit: HUB_COUNT_SEARCH_ITEMS,
      returnSubmit: HUB_RETURN,
      fetchPackageDetail: FETCH_PACKAGE_DETAIL,
    }),
    select(item) {
      this.$emit('select', item)
    },
    async searchHandle() {
      this.handleUpdateRouteQuery()

      const filters = Object.assign({}, this.filter)
      filters.status = HUB_TAB_IDS[this.filter.status]

      this.isFetching = true

      const res = await Promise.all([
        this.searchSubmit(filters),
        this.countSearchSubmit(filters),
      ])

      this.isFetching = false

      for (const v of res) {
        if (v.error) {
          this.$toast.error(v.message)
        }
      }
    },
    async showModalReturnHandle(item) {
      const res = await this.fetchPackageDetail(item.id)
      if (res.error) {
        this.$toast.error(res.message)
        return false
      }

      if (item.id != res.package.id) return

      this.current = {
        id: item.id,
        code: item.code,
        package_return: res.package.package_return,
      }

      this.isShowModalReturn = true
    },
    async returnHandle(payload) {
      const res = await this.returnSubmit(payload)
      if (res.error) {
        this.$toast.error(res.message)
        return false
      }

      this.isShowModalReturn = false
      this.current = {}
      this.$toast.success('Thêm lý do trả hàng thành công')

      await this.searchHandle()

      return true
    },
  },
  watch: {
    'filter.page': function () {
      this.searchHandle()
    },
    'filter.limit': function () {
      this.filter.page = 1
      this.searchHandle()
    },
  },
}
</script>
