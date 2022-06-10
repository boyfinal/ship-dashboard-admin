<template>
  <div class="setting setting-account pages">
    <div class="page-content">
      <div class="d-flex mb-16">
        <user-resource
          id="search"
          v-model="userInfo"
          class="user-resource is-fullwidth"
          :filter="{ role: 'customer' }"
          :search="filter.search"
          :label="`Tìm khách hàng`"
          :emitID="false"
          :is-tester="isTester"
          @input="handleSearch"
        />
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
              <table class="table table-hover table-cumtomers">
                <thead>
                  <tr>
                    <th width="120">Khách hàng</th>
                    <th width="300">Email</th>
                    <th max-width="50">Loại tài khoản</th>
                    <th max-width="80">Kiểu thanh toán</th>
                    <th max-width="50">Số dư hiện tại</th>
                    <th max-width="80">Công nợ hiện tại</th>
                    <th max-width="80">Công nợ cho phép</th>
                    <th max-width="80">Thời gian cho phép</th>
                    <th width=""></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in displayUsers" :key="i">
                    <td class="user-fullname">
                      <p-tooltip
                        :label="item.full_name"
                        size="large"
                        position="top"
                        type="dark"
                        :active="item.full_name.length > 25"
                      >
                        {{ item.full_name_short }}
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
                        {{ item.email_short }}
                      </p-tooltip>
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <p-svg
                          :name="item.type_icon"
                          style="margin-right: 4px"
                        ></p-svg>
                        {{ types[item.class] }}</div
                      >
                    </td>
                    <td>
                      <span
                        v-if="item.is_debt"
                        class="badge badge-round badge-primary"
                        >{{ item.payment_type }}</span
                      >
                      <span v-else class="badge badge-round badge-default">{{
                        item.payment_type
                      }}</span>
                    </td>
                    <td>{{ item.balance | formatPrice }}</td>
                    <td>{{ item.debt | formatPrice }}</td>
                    <td>{{ item.debt_max_amount | formatPrice }}</td>
                    <td>{{ item.debt_max_day }}</td>
                    <td>
                      <div class="d-flex" style="align-items: center">
                        <router-link
                          class="btn_action mr-2"
                          :to="{
                            name: 'bill-list',
                            query: {
                              search_by: 'customer',
                              search: item.email,
                              tab: 'bill',
                            },
                          }"
                        >
                          <p-tooltip
                            :label="'Hóa đơn'"
                            size="large"
                            position="top"
                            type="dark"
                            :active="true"
                          >
                            <p-svg name="receipt"></p-svg>
                          </p-tooltip>
                        </router-link>
                        <router-link
                          class="btn_action"
                          :to="{
                            name: 'bill-list',
                            query: {
                              search_by: 'customer',
                              search: item.email,
                              tab: 'topup',
                            },
                          }"
                        >
                          <p-tooltip
                            :label="'Thanh toán'"
                            size="large"
                            position="top"
                            type="dark"
                            :active="true"
                          >
                            <p-svg name="clock_history"></p-svg>
                          </p-tooltip>
                        </router-link>
                        <a
                          href="#"
                          class="btn_action ml-2"
                          v-if="$isAdmin()"
                          @click.prevent="editUser(item.id)"
                        >
                          <p-tooltip
                            :label="'Cài đặt'"
                            size="large"
                            position="top"
                            type="dark"
                            :active="true"
                          >
                            <p-svg name="setting"></p-svg>
                          </p-tooltip>
                        </a>
                      </div>
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
    <modal-edit-user
      v-if="isVisibleEditUser"
      :visible.sync="isVisibleEditUser"
      :current="userSelected"
      @success="updateSuccess"
      @close="closeEdit"
    >
    </modal-edit-user>
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
import ModalEditUser from '../components/ModalEdit'
import {
  MAP_USER_CLASS_TEXT,
  MAP_USER_CLASS_ICON,
  USER_STATUS_ACTIVE,
} from '../constants'
import UserResource from '@/components/shared/resource/UsersActive'

export default {
  name: 'Debt',
  mixins: [mixinRoute, mixinTable, mixinDownload],
  components: {
    EmptySearchResult,
    ModalExport,
    ModalEditUser,
    UserResource,
  },
  data() {
    return {
      filter: {
        limit: 30,
        search: '',
        status: USER_STATUS_ACTIVE,
      },
      isTester: this.$route.query.tester
        ? parseInt(this.$route.query.tester)
        : 0,
      isFetching: false,
      visibleExportModal: false,
      isExporting: false,
      ROLE_ADMIN: ROLE_ADMIN,
      ROLE_ACCOUNTANT: ROLE_ACCOUNTANT,
      userSelected: {},
      isVisibleEditUser: false,
      userInfo: null,
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
      return PACKAGE_STATUS_TAB.filter((x) => x.value != 'alert')
    },
    types() {
      return MAP_USER_CLASS_TEXT
    },
    typesClass() {
      return MAP_USER_CLASS_ICON
    },
    displayUsers() {
      return this.users.map((item) => {
        const nameShort =
          item.full_name.length > 25
            ? truncate(item.full_name, 25)
            : item.full_name
        const email = item.email || item.phone_number
        const emailShort = email.length > 25 ? truncate(email, 25) : email
        const info = item.user_info || {}
        const debtMaxAmount = parseFloat(info.debt_max_amount) || 0
        const debtMaxDay = parseInt(info.debt_max_day) || 0
        const balance = parseFloat(item.balance || 0)

        return {
          id: item.id,
          full_name: item.full_name,
          full_name_short: nameShort,
          phone_number: item.phone_number,
          email,
          email_short: emailShort,
          debt_max_amount: debtMaxAmount,
          is_debt: debtMaxAmount > 0,
          debt_max_day: debtMaxAmount > 0 ? `${debtMaxDay} ngày` : '-',
          payment_type: debtMaxAmount > 0 ? 'Trả sau' : 'Trả trước',
          debt: balance > 0 ? 0 : Math.abs(balance),
          balance: balance > 0 ? balance : 0,
          class: item.class,
          active: item.status == USER_STATUS_ACTIVE,
          type_icon: MAP_USER_CLASS_ICON[item.class] || '',
        }
      })
    },
  },
  methods: {
    truncate,
    ...mapActions('setting', [LIST_USER, EXPORT_PACKAGE]),
    handleSearch() {
      this.filter.page = 1
      this.filter.search = this.userInfo ? this.userInfo.email : ''

      this.init()
    },
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      const filter = Object.assign({ role: ROLE_CUSTOMER }, this.filter)
      const result = await this.listUser(filter)
      if (!result.success) {
        this.$toast.error(result.message)
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

    editUser(userId) {
      const user = this.users.find(({ id }) => id == userId)
      if (!user) return

      this.userSelected = user
      this.isVisibleEditUser = true
    },
    updateSuccess() {
      this.closeEdit()
      this.init()
    },
    closeEdit() {
      this.userSelected = {}
      this.isVisibleEditUser = false
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
<style lang="scss" scoped>
.table-cumtomers {
  tbody tr td {
    padding: 10px 5px;
    border-radius: 0;
  }

  th {
    text-transform: initial;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 22px;
    color: #111212;
  }
}
.user-status {
  .fa-circle {
    color: #cfd0d0;
    margin-right: 3px !important;
    margin-top: 0 !important;
    vertical-align: middle;
    line-height: 18px;
    &.active {
      color: #48be78;
    }
  }
}
.user-fullname {
  &,
  span {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: #313232;
  }
}
</style>
