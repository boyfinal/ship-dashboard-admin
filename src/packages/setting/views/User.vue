<template>
  <div class="setting setting-account pages">
    <div class="page-content">
      <div class="mb-16">
        <all-user
          id="search"
          class="user-resource is-fullwidth"
          :filter="{ role: 'customer' }"
          :label="`Tìm theo tên khách hàng hoặc email`"
          :emitID="false"
          v-model="user"
          @input="init"
        />
      </div>
      <div class="card">
        <div class="card-body">
          <status-tab
            v-model="filter.status"
            :status="statusUser"
            :hasAll="false"
          />
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="users.length">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Ngày tạo</th>
                    <th width="150">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in users" :key="i">
                    <td class="user-fullname">
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
                    <td>
                      <div> {{ item.phone_number || 'N/A' }}</div>
                    </td>
                    <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                    <td>
                      <a
                        href="#"
                        class="btn"
                        :class="{
                          lock: item.status == statusActive,
                          edit: item.status != statusActive,
                        }"
                        @click.prevent="visibleModal(item)"
                      >
                        {{ textButton(item.status) }}
                      </a></td
                    >
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
    <modal-confirm
      :visible.sync="visibleConfirmLock"
      :actionConfirm="`Khóa tài khoản`"
      :cancel="`Bỏ qua`"
      :description="`Bạn có chắc chắn muốn khóa tài khoản này?`"
      :title="`Xác nhận`"
      :type="'danger'"
      @action="handleUpdateStatus(item)"
    ></modal-confirm>
    <modal-confirm
      :visible.sync="visibleConfirmUnlock"
      :actionConfirm="`Mở tài khoản`"
      :cancel="`Bỏ qua`"
      :description="`Bạn có chắc chắn muốn mở tài khoản này?`"
      :title="`Xác nhận`"
      @action="handleUpdateStatus(item)"
    ></modal-confirm>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { truncate } from '@core/utils/string'
import { LIST_USER, UPDATE_STATUS_USER } from '../store/index'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import {
  CUSTOMER_STATUS_TAB,
  USER_STATUS_DEACTIVE,
  USER_STATUS_ACTIVE,
  USER_STATUS_INACTIVE,
} from '../constants'
import AllUser from '@/components/shared/resource/AllUser'
import { ROLE_CUSTOMER } from '@core/constants'
import ModalConfirm from '@components/shared/modal/ModalConfirm'

export default {
  name: 'Debt',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    AllUser,
    ModalConfirm,
  },
  data() {
    return {
      filter: {
        limit: 30,
        search: '',
        status: 2,
      },
      isFetching: false,
      statusUser: CUSTOMER_STATUS_TAB,
      user: null,
      statusDeactive: USER_STATUS_DEACTIVE,
      statusActive: USER_STATUS_ACTIVE,
      statusInActive: USER_STATUS_INACTIVE,
      visibleConfirmLock: false,
      visibleConfirmUnlock: false,
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
  },
  methods: {
    truncate,
    ...mapActions('setting', [LIST_USER, UPDATE_STATUS_USER]),

    async init() {
      this.filter.search = this.user ? this.user.email : ''
      this.isFetching = true
      this.handleUpdateRouteQuery()
      const filter = Object.assign({ role: ROLE_CUSTOMER }, this.filter)
      const result = await this.listUser(filter)
      if (!result.success) {
        this.$toast.error(result.message)
      }
      this.isFetching = false
    },
    textButton(status) {
      switch (status) {
        case this.statusInActive:
          return `Kích hoạt`
        case this.statusActive:
          return `Khóa tài khoản`
        case this.statusDeactive:
          return `Mở tài khoản`
        default:
          return null
      }
    },
    visibleModal(item) {
      if (item.status == this.statusActive) {
        this.visibleConfirmLock = true
      } else this.visibleConfirmUnlock = true
      this.item = item
    },
    async handleUpdateStatus(item) {
      let payload = {
        id: item.id,
        status: item.status == this.statusActive ? 0 : 1,
      }

      const result = await this.updateStatusUser(payload)
      this.visibleConfirmLock = false
      this.visibleConfirmUnlock = false

      if (!result || result.error) {
        return this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
      }
      await this.init()
      this.$toast.open({
        type: 'success',
        message: 'Cập nhật thành công',
        duration: 3000,
      })
    },
  },
  watch: {
    'filter.page': {
      handler: function () {
        this.init()
      },
      deep: true,
    },
    'filter.status': {
      handler: function () {
        this.init()
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
