<template>
  <div class="setting setting-account pages">
    <div class="page-content">
      <div class="d-flex mb-16">
        <p-input
          placeholder="Tìm theo tên/email"
          prefixIcon="search"
          type="search"
          :clearable="true"
          :value.sync="filter.search"
          @keyup.enter="handleSearch"
        >
        </p-input>
        <button
          @click="handleShowModalExport"
          class="btn btn-info ml-3 text-nowrap"
          v-if="user.role == ROLE_ADMIN || user.role == ROLE_ACCOUNTANT"
          >Export</button
        >
      </div>
      <div class="card">
        <div class="card-body">
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="users.length">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th width="200">Họ tên</th>
                    <th width="150">Email</th>
                    <th width="200">Số điện thoại</th>
                    <th width="100">Số dư</th>
                    <th width="150">Số nợ</th>
                    <th width="150">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in users" :key="i">
                    <td>
                      <p-tooltip
                        :label="item.full_name"
                        size="large"
                        position="top"
                        type="dark"
                        :active="item.full_name.length > 25"
                      >
                        {{ truncate(item.full_name, 25) }}
                      </p-tooltip>
                    </td>
                    <td>
                      <p-tooltip
                        :label="item.email"
                        size="large"
                        position="top"
                        type="dark"
                        :active="item.email.length > 25"
                      >
                        {{ truncate(item.email, 25) }}
                      </p-tooltip>
                    </td>
                    <td>{{ item.phone_number }}</td>
                    <td>{{
                      item.balance > 0 ? item.balance : 0 | formatPrice
                    }}</td>
                    <td>{{
                      item.balance > 0
                        ? 0
                        : Math.abs(item.balance) | formatPrice
                    }}</td>
                    <td class="d-flex" style="align-items:center">
                      <router-link
                        class="btn_action mr-2"
                        :to="{
                          name: 'bill-list',
                          query: {
                            search_by: 'customer',
                            search: item.email,
                          },
                        }"
                      >
                        Hóa đơn
                      </router-link>
                      <router-link
                        class="btn_action"
                        :to="{
                          name: 'list-transaction',
                          query: {
                            search_by: 'account',
                            search: item.email,
                          },
                        }"
                      >
                        Lịch sử
                      </router-link>
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
    <modal-export
      :options="statusPackage"
      :visible.sync="visibleExportModal"
      :loading="isExporting"
      @save="handleExport"
    >
    </modal-export>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { truncate } from '@core/utils/string'
import { ROLE_CUSTOMER } from '@core/constants'
import { LIST_USER, EXPORT_PACKAGE } from '../store/index'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import ModalExport from '../components/ModalExport'
import { PACKAGE_STATUS_TAB } from '../../package/constants'
import mixinDownload from '@/packages/shared/mixins/download'
import { ROLE_ADMIN, ROLE_ACCOUNTANT } from '@core/constants'

export default {
  name: 'Debt',
  mixins: [mixinRoute, mixinTable, mixinDownload],
  components: {
    EmptySearchResult,
    ModalExport,
  },
  data() {
    return {
      filter: {
        limit: 30,
        search: '',
        role: ROLE_CUSTOMER,
      },
      isFetching: false,
      visibleExportModal: false,
      isExporting: false,
      ROLE_ADMIN: ROLE_ADMIN,
      ROLE_ACCOUNTANT: ROLE_ACCOUNTANT,
    }
  },
  created() {
    this.filter = this.getRouteQuery()
  },
  mounted() {
    this.init()
  },
  computed: {
    ...mapState('setting', {
      users: (state) => state.users,
      count: (state) => state.count_user,
    }),
    ...mapState('shared', {
      user: (state) => state.user,
    }),
    statusPackage() {
      return PACKAGE_STATUS_TAB
    },
  },
  methods: {
    truncate,
    ...mapActions('setting', [LIST_USER, EXPORT_PACKAGE]),

    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      const result = await this.listUser(this.filter)
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
      this.isFetching = false
    },

    handleShowModalExport() {
      this.visibleExportModal = true
    },

    async handleExport(payload) {
      this.isExporting = true
      const result = await this[EXPORT_PACKAGE](payload)
      this.isExporting = false

      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        return
      }
      this.downloadPackage(result.url, 'packages', result.url.split('/')[1])
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
